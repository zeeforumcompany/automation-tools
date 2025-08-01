'use client';

import { handleChange } from '@/helpers/functions';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Link from 'next/link';
import { useState } from 'react';

export default function App() {
	const [form, setForm] = useState({
		flow: "",
	});

	const [initialEdges, setInitialEdges] = useState([]);
	const [initialNodes, setInitialNodes] = useState([]);

	console.log(form);

	const setupFlow = () => {
		try {
			const nodes = [];

			const flowJson = JSON.parse(form.flow);
			const actions = flowJson.actions;
			const branches = flowJson.branches;

			Object.keys(actions).forEach((key) => {
				const action = actions[key];

				let x = action.x || 0;
				let y = action.y || 0;

				nodes.push({
					id: `n${action.actionId}`,
					position: { x, y },
					data: { label: action.label || action.name },
					type: 'default',
					dependencyOrder: action.dependencyOrder,
					sourcePosition: 'right',
					targetPosition: 'left',
				});
			});

			nodes.sort((a, b) => {
				return a.dependencyOrder - b.dependencyOrder;
			});
			console.log(nodes);

			const edges = [];
			Object.keys(branches).forEach((key) => {
				const branch = branches[key];
				branch.forEach((edge) => {
					edges.push({
						id: `e${edge.to}-${key}`,
						source: `n${key}`,
						target: `n${edge.to}`,
						type: 'default',
						label: edge.label || '',
						markerEnd: {
							type: MarkerType.ArrowClosed,
						},
					});
				});
			});

			setInitialNodes(nodes);
			setInitialEdges(edges);
		} catch (error) {
			console.error("Error setting up flow:", error);
		}
	}

  return (
	<>
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>
		</div>

		<div className="py-4">
			<h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Visualize Flow</h1>
			<p className='text-gray-500 mb-4'>Paste your flow JSON below to visualize it. It will not be perfect but you will have some idea how it will look alike.</p>

			<div className='flex flex-col mb-4'>
				<label htmlFor="flow">Flow JSON</label>
				<textarea id="flow" value={form.flow} onChange={(e) => handleChange(e, setForm)} name="flow" className="border border-gray-300 p-2" rows={10} />
			</div>
			<button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer" onClick={setupFlow}>Setup Flow</button>

			<div className='h-lvh w-full p-4'>
				<ReactFlow nodes={initialNodes} edges={initialEdges} attributionPosition="top-right" className='bg-gray-100'>
					<Background />
					<Controls />
				</ReactFlow>
			</div>
		</div>
	</>
  );
}