export function ReadDocumentStep() {
	return (
		<>
			<p>
				Você está iniciando a assinatura deste contrato. Leia
				atentamente antes de prosseguir.
			</p>

			<div
				style={{
					height: 200,
					overflow: 'auto',
					border: '1px solid #ccc',
					padding: 10,
					marginTop: 16,
				}}
			>
				<p>Conteúdo do contrato...</p>
			</div>
		</>
	)
}
