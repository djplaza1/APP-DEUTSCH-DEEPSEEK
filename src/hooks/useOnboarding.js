// Hook para el onboarding inicial (tour de bienvenida)
window.useOnboardingState = function() {
    const [showOnboarding, setShowOnboarding] = React.useState(() => {
        try { return !localStorage.getItem(MULLER_ONBOARDING_KEY); } catch (e) { return true; }
    });
    const [onboardingStep, setOnboardingStep] = React.useState(1);
    const [onboardingNever, setOnboardingNever] = React.useState(false);

    function finishOnboarding() {
        try { localStorage.setItem(MULLER_ONBOARDING_KEY, '1'); } catch (e) {}
        setShowOnboarding(false);
        setOnboardingStep(1);
    }

    return {
        showOnboarding,
        setShowOnboarding,
        onboardingStep,
        setOnboardingStep,
        onboardingNever,
        setOnboardingNever,
        finishOnboarding
    };
};
