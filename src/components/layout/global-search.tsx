"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Loader2 } from "lucide-react"

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { navGroups } from "@/components/layout/nav-items"
import { searchClientsAction } from "@/features/clients/actions"
import { initials } from "@/utils/initials"

interface ClientResult {
  id: string
  name: string
  phone: string | null
  email: string | null
  photo: string | null
}

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [results, setResults] = React.useState<ClientResult[]>([])

  // keyboard shortcut: Cmd/Ctrl+K toggles the palette
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // debounce the raw input into `debouncedQuery`
  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 200)
    return () => clearTimeout(timeout)
  }, [query])

  // fetch once the debounced query settles
  React.useEffect(() => {
    if (!open || !debouncedQuery.trim()) return
    searchClientsAction(debouncedQuery).then(setResults)
  }, [debouncedQuery, open])

  const loading = open && query.trim() !== "" && query !== debouncedQuery

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setQuery("")
      setDebouncedQuery("")
      setResults([])
    }
  }

  function go(href: string) {
    handleOpenChange(false)
    router.push(href)
  }

  const trimmedQuery = query.trim()
  const visibleResults = trimmedQuery && !loading ? results : []
  const navMatches = navGroups
    .flatMap((g) => g.items)
    .filter((item) => item.label.toLowerCase().includes(trimmedQuery.toLowerCase()))

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="hidden w-full max-w-xs items-center justify-between gap-2 font-normal text-muted-foreground md:flex"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Buscar clientes, agendamentos...
        </span>
        <kbd className="pointer-events-none hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground select-none sm:inline-flex">
          <span>⌘</span>K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="md:hidden"
        aria-label="Buscar"
      >
        <Search className="size-[18px]" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Busca global"
        description="Busque clientes ou navegue pelo sistema"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar clientes, ir para uma seção..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Buscando...
              </div>
            ) : (
              <>
                {trimmedQuery && visibleResults.length === 0 && navMatches.length === 0 ? (
                  <CommandEmpty>Nada encontrado para &ldquo;{query}&rdquo;.</CommandEmpty>
                ) : null}

                {visibleResults.length > 0 ? (
                  <CommandGroup heading="Clientes">
                    {visibleResults.map((client) => (
                      <CommandItem
                        key={client.id}
                        value={client.id}
                        onSelect={() => go(`/clientes/${client.id}`)}
                      >
                        <Avatar className="size-6">
                          {client.photo ? <AvatarImage src={client.photo} alt={client.name} /> : null}
                          <AvatarFallback className="bg-accent text-[10px] text-accent-foreground">
                            {initials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate">{client.name}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {client.phone ?? client.email ?? ""}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : null}

                <CommandGroup heading="Navegação">
                  {(trimmedQuery ? navMatches : navGroups.flatMap((g) => g.items)).map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem key={item.href} value={item.href} onSelect={() => go(item.href)}>
                        <Icon className="size-4" />
                        <span className="flex-1">{item.label}</span>
                        <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-data-selected/command-item:opacity-100" />
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
