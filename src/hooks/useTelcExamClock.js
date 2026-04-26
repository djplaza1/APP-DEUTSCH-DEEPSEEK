function useTelcExamClock(examCtx) {
    const [, setTick] = React.useState(0);
    React.useEffect(() => {
        if (!examCtx) return undefined;
        const id = setInterval(() => setTick((t) => t + 1), 1000);
        return () => clearInterval(id);
    }, [examCtx]);
}

