import { Avatar as ChakraAvatar } from "@chakra-ui/react"
import * as React from "react"

// Interface para garantir consistência e tipagem forte
export interface AvatarProps extends ChakraAvatar.RootProps {
  name?: string
  src?: string
  srcSet?: string
  fallback?: React.ReactNode
  icon?: React.ReactElement
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const { name, src, srcSet, fallback, icon, ...rest } = props
    return (
      <ChakraAvatar.Root ref={ref} {...rest}>
        <AvatarFallback name={name} icon={icon}>
          {fallback}
        </AvatarFallback>
        <ChakraAvatar.Image src={src} srcSet={srcSet} />
      </ChakraAvatar.Root>
    )
  },
)

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  ChakraAvatar.FallbackProps & { name?: string; icon?: React.ReactElement }
>(function AvatarFallback(props, ref) {
  const { name, icon, children, ...rest } = props
  return (
    <ChakraAvatar.Fallback ref={ref} {...rest}>
      {children}
      {name != null && children == null && <>{getInitials(name)}</>}
      {name == null && children == null && (
        <ChakraAvatar.Icon asChild={!!icon}>{icon}</ChakraAvatar.Icon>
      )}
    </ChakraAvatar.Fallback>
  )
})

// Função para gerar iniciais (ex: Yara -> Y)
function getInitials(name: string) {
  const names = name.trim().split(" ")
  const firstName = names[0]
  const lastName = names.length > 1 ? names[names.length - 1] : ""
  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0)
}