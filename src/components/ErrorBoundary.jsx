import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-container-max mx-auto my-20 bg-error-container text-on-error-container rounded-2xl border border-error">
          <h2 className="font-headline-md text-headline-md mb-4">Noe gikk galt under visningen av denne siden</h2>
          <pre className="p-4 bg-white/50 rounded-lg overflow-auto font-mono text-[14px] whitespace-pre-wrap">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-label-md text-label-md hover:bg-primary-container transition-all"
          >
            Prøv igjen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
