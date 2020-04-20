function graph = initgraph(Nnodes,edges, filename)

disp(Nnodes);
disp(edges);

A = sparse(edges(:,1),edges(:,2),1,Nnodes,Nnodes);
graph = full(A);

plotgraph(graph);

print(strcat(filename, "-1.png"));

return;
