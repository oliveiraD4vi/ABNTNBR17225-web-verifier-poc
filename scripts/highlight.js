const TOOLTIP_ID = 'accessibility-tooltip-overlay';

const createTooltip = () => {
	if (document.getElementById(TOOLTIP_ID)) return;

	const tooltip = document.createElement('div');
	tooltip.id = TOOLTIP_ID;
	tooltip.style.position = 'fixed';
	tooltip.style.pointerEvents = 'none';
	tooltip.style.zIndex = 9999;
	tooltip.style.maxWidth = '300px';
	tooltip.style.background = 'rgba(0, 0, 0, 0.85)';
	tooltip.style.color = '#fff';
	tooltip.style.padding = '8px 12px';
	tooltip.style.borderRadius = '6px';
	tooltip.style.fontSize = '12px';
	tooltip.style.lineHeight = '1.4';
	tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
	tooltip.style.display = 'none';
	tooltip.style.transition = 'opacity 0.2s ease';

	document.body.appendChild(tooltip);
};

const showTooltip = (event, name, description, iconWrapper) => {
	const tooltip = document.getElementById(TOOLTIP_ID);

	if (!tooltip) return;

	const span = document.createElement('span');
	span.style.color = '#fff';
	span.innerHTML = description;

	const strong = document.createElement('strong');
	strong.style.color = '#fff';
	strong.innerHTML = `${name}: `;

	tooltip.innerHTML = '';
	tooltip.appendChild(strong);
	tooltip.appendChild(span);
	tooltip.style.display = 'block';
	tooltip.style.opacity = '1';

	const offset = 10;

	requestAnimationFrame(() => {
		const tooltipRect = tooltip.getBoundingClientRect();
		let left = event.clientX + offset;
		let top = event.clientY + offset;

		if (left + tooltipRect.width > window.innerWidth) {
			left = event.clientX - tooltipRect.width - offset;
		}

		if (top + tooltipRect.height > window.innerHeight) {
			top = event.clientY - tooltipRect.height - offset;
		}

		tooltip.style.left = `${Math.max(left, 0)}px`;
		tooltip.style.top = `${Math.max(top, 0)}px`;
	});

	if (iconWrapper) {
		const onClickOutside = (e) => {
			if (!tooltip.contains(e.target) && !iconWrapper.contains(e.target)) {
				hideTooltip();
				document.removeEventListener('click', onClickOutside);
			}
		};

		setTimeout(() => document.addEventListener('click', onClickOutside), 0);
	};
};

const hideTooltip = () => {
	const tooltip = document.getElementById(TOOLTIP_ID);
	if (tooltip) {
		tooltip.style.display = 'none';
		tooltip.style.opacity = '0';
	}
};

const ICON_REFERENCES = [];

const repositionIcons = () => {
	ICON_REFERENCES.forEach(({ iconWrapper, el, nodeToAppend }) => {
		if (!document.body.contains(el)) {
			iconWrapper.remove();
			return;
		}

		const elRect = el.getBoundingClientRect();
		const parentRect = nodeToAppend.getBoundingClientRect();
		const offsetTop = elRect.top - parentRect.top - 16;
		const offsetLeft = elRect.right - parentRect.left - 16;

		iconWrapper.style.top = `${offsetTop}px`;
		iconWrapper.style.left = `${offsetLeft}px`;
	});
};

const setIcon = (el, issue, color, severityIconHTML) => {
	if (!el || !severityIconHTML) return;

	const iconWrapper = document.createElement('span');

	iconWrapper.innerHTML = severityIconHTML;
	iconWrapper.style.position = 'absolute';
	iconWrapper.style.cursor = 'pointer';
	iconWrapper.style.zIndex = '10000';
	iconWrapper.style.background = color;
	iconWrapper.style.borderRadius = '50%';
	iconWrapper.style.width = '1.25rem';
	iconWrapper.style.height = '1.25rem';
	iconWrapper.style.display = 'grid';
	iconWrapper.style.placeContent = 'center';

	const nodeToAppend = el.parentNode || el;

	if (window.getComputedStyle(nodeToAppend).position === 'static') {
		nodeToAppend.style.position = 'relative';
	}

	const elRect = el.getBoundingClientRect();
	const parentRect = nodeToAppend.getBoundingClientRect();
	const offsetTop = elRect.top - parentRect.top - 16;
	const offsetLeft = elRect.right - parentRect.left - 16;

	iconWrapper.style.top = `${offsetTop}px`;
	iconWrapper.style.left = `${offsetLeft}px`;

	iconWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		e.preventDefault();
		showTooltip(e, issue.name, issue.description || '', iconWrapper);
	});

	nodeToAppend.appendChild(iconWrapper);

	ICON_REFERENCES.push({ iconWrapper, el, nodeToAppend, issue });
};

const highlight = (issue, color) => {
	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(issue.snippet, 'text/html');
		const tag = doc.body.firstElementChild;

		if (!tag) return;

		const tagName = tag.tagName.toLowerCase();
		const classList = [...tag.classList];

		const selector = classList.length
			? `${tagName}.${classList.join('.')}`
			: tagName;

		const matches = document.querySelectorAll(selector);

		matches.forEach(el => {
			el.style.borderColor = `2px solid ${color}`;
			el.style.boxShadow = `0px 0px 10px 5px ${color}`;
			el.setAttribute('data-issue-id', issue.id);

			setIcon(el, issue, color, SEVERITY[issue.severity].icon);

			const onMouseMove = (e) => showTooltip(e, issue.name, issue.description || '');
			const onMouseLeave = hideTooltip;

			el.addEventListener('mousemove', onMouseMove);
			el.addEventListener('mouseleave', onMouseLeave);
		});

		window.addEventListener('scroll', repositionIcons, true);
		window.addEventListener('resize', repositionIcons);
	} catch (err) {
		console.warn('Erro ao processar o snippet:', issue.snippet, err);
	}
}

const highlightIssuesBySeverity = (issues) => {
	createTooltip();

	Object.entries(issues).forEach(([severity, items]) => {
		const rgb = SEVERITY[severity]?.color || [0, 0, 0];
		const color = `rgba(${rgb.join(',')}, 0.5)`;

		items.forEach(issue => {
			highlight(issue, color);
		});
	});
}
