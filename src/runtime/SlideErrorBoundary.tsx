import { Component, type ErrorInfo, type ReactNode } from 'react'

type SlideErrorBoundaryProps = {
  children: ReactNode
  resetKeys: readonly unknown[]
  slideFile: string
  slideNumber: number
}

type SlideErrorBoundaryState = {
  componentStack: string | null
  error: unknown
  hasError: boolean
}

const initialState: SlideErrorBoundaryState = {
  componentStack: null,
  error: null,
  hasError: false,
}

const getErrorName = (error: unknown) =>
  error instanceof Error ? error.name : 'Unknown error'

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unknown slide error occurred.'
}

const getErrorStack = (error: unknown) =>
  error instanceof Error ? error.stack : null

const didResetKeysChange = (
  previousKeys: readonly unknown[],
  nextKeys: readonly unknown[],
) =>
  previousKeys.length !== nextKeys.length ||
  previousKeys.some((previousKey, index) => !Object.is(previousKey, nextKeys[index]))

export class SlideErrorBoundary extends Component<
  SlideErrorBoundaryProps,
  SlideErrorBoundaryState
> {
  state = initialState

  static getDerivedStateFromError(error: unknown) {
    return { error, hasError: true }
  }

  componentDidCatch(_error: unknown, errorInfo: ErrorInfo) {
    this.setState({ componentStack: errorInfo.componentStack ?? null })
  }

  componentDidUpdate(previousProps: SlideErrorBoundaryProps) {
    if (
      this.state.hasError &&
      didResetKeysChange(previousProps.resetKeys, this.props.resetKeys)
    ) {
      this.setState(initialState)
    }
  }

  reset = () => {
    this.setState(initialState)
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const errorStack = getErrorStack(this.state.error)

    return (
      <div className="flex h-full w-full bg-zinc-950 px-20 py-16 text-zinc-100">
        <section className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-red-400/30 bg-zinc-900 shadow-2xl">
          <div className="border-b border-white/10 bg-red-950/70 px-10 py-7">
            <p className="font-mono text-xl font-semibold uppercase tracking-normal text-red-200">
              Slide {this.props.slideNumber} crashed
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight tracking-normal text-white">
              {getErrorName(this.state.error)}
            </h1>
            <p className="mt-4 break-words font-mono text-2xl leading-snug text-red-100">
              {getErrorMessage(this.state.error)}
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[0.8fr_1.2fr] gap-8 overflow-hidden p-10">
            <div className="flex min-h-0 flex-col">
              <dl className="space-y-6 text-2xl">
                <div>
                  <dt className="font-mono text-base uppercase tracking-normal text-zinc-500">
                    Slide file
                  </dt>
                  <dd className="mt-2 break-all font-mono text-zinc-200">
                    {this.props.slideFile}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-base uppercase tracking-normal text-zinc-500">
                    Runtime status
                  </dt>
                  <dd className="mt-2 text-zinc-200">
                    Navigation and edit mode remain available.
                  </dd>
                </div>
              </dl>

              <button
                className="mt-auto w-fit rounded-md border border-white/15 bg-white px-5 py-3 text-xl font-semibold text-zinc-950 shadow-lg transition hover:bg-zinc-200"
                onClick={(event) => {
                  event.stopPropagation()
                  this.reset()
                }}
                type="button"
              >
                Retry slide
              </button>
            </div>

            <div className="min-h-0 overflow-auto rounded-md border border-white/10 bg-black/45 p-6">
              <pre className="whitespace-pre-wrap break-words font-mono text-lg leading-relaxed text-zinc-300">
                {errorStack ?? this.state.componentStack ?? 'No stack trace available.'}
              </pre>
            </div>
          </div>
        </section>
      </div>
    )
  }
}
