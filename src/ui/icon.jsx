var Icon = ({ name, className, nav = false }) => {
    const inner = <span className="lucide-wrapper" dangerouslySetInnerHTML={{ __html: `<i data-lucide="${name}" class="${className || ''}"></i>` }} />;
    return nav ? <span className="nav-tab-icon">{inner}</span> : inner;
};

window.Icon = Icon;
