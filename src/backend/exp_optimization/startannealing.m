function startannealing(Nnodes,edges,alpha,deltaT, filename)

A = sparse(edges(:,1),edges(:,2),1,Nnodes,Nnodes);
graph = full(A);

bpgraph = graphbipartition(graph, alpha, deltaT);

plotgraph(bpgraph);

print(strcat(filename, "-2.png"))

return;
