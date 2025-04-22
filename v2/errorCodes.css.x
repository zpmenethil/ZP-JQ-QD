/* F:\_Zenith_Github\ZP-JQ-QD\v2\errorCodes.css */
/* Error Codes Modal Styles */
#errorCodesBtn {
	color: var(--text-color);
	transition: color 0.2s ease;
}

#errorCodesBtn:hover {
	color: var(--primary-color);
}

#errorCodesModal .modal-dialog {
	max-width: 800px;
}

#errorCodesModal .modal-body {
	padding: 1.5rem;
}

#errorCodesModal .table {
	margin-bottom: 0;
}

#errorCodesModal .badge {
	font-family: monospace;
	font-size: 0.9rem;
	padding: 0.35em 0.65em;
}

#errorCodesModal .bg-primary-subtle {
	background-color: rgba(var(--bs-primary-rgb), 0.1);
}

[data-bs-theme='dark'] #errorCodesModal .bg-primary-subtle {
	background-color: rgba(var(--bs-primary-rgb), 0.2);
}

#errorCodesModal thead th {
	position: sticky;
	top: 0;
	background-color: var(--card-bg);
	z-index: 1;
	font-size: 0.9rem;
	color: var(--secondary-color);
}

#errorCodesModal tbody td {
	vertical-align: middle;
	padding: 0.75rem 0.5rem;
}

#errorCodesModal .form-floating input:focus,
#errorCodesModal .form-floating select:focus {
	border-color: var(--primary-color);
}

@media (max-width: 768px) {
	#errorCodesModal .row > div {
		margin-bottom: 1rem;
	}

	#errorCodesModal .row > div:last-child {
		margin-bottom: 0;
	}
}
