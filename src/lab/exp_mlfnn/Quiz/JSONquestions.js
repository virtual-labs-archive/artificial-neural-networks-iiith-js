var questions = [
["What can be done by using non-linear output function for each processing unit in a feedback network?", "Pattern Classification" , "Recall", "Pattern storage", "All of the above", "3"],
["How can states of units be updated in hopfield model?", "Synchronously", "Asynchronously", "Synchronously and Asynchronously", "None of the above", "3"],
["If pattern is to be stored, then what does stable state should have updated value of?", "Current state", "Next state", "Both current and next state", "None of the above", "1"],
["In hopfield network with symmetric weights, energy at each state may?", "Increase", "Decrease", "Remains same", "Remains same or decrease", "4"],
["How can error in recall due to false minima be further reduced?", "Cannot be further reduced", "Using suitable activation dynamics", "By storing desired patterns at energy maxima", "None of the above", "2"],
["Back propagation is a learning technique that adjusts weights in the neural network by propagating weight changes", "Backward from sink to hidden nodes", "Forward from source to hidden nodes", "Forward from source to sink", "Backward from sink to source", "4"],
["Which of the following neural networks uses supervised learning?", "Multilayer perceptron", "Self organizing feature map", "Hopfield network", "All of these", "1"],
["Which of the following options is correct?", "Assignment problem can be used to minimize the cost", "Assignment problem is a special case of transportation problem", "Assignment problem requires that only one activity be assigned to each resource", "All of these", "4"],
["A neuron with 3 inputs has the weight vector [0.2  -0.1  0.1]^T and a bias theta = 0. If the input vector is X = [0.2  0.4  0.2]^T then the total input to the neuron is", "0.20", "1.0", "0.02", "-1.0", "3"],
["What are the issues on which biological networks proves to be superior than AI networks?", "Robustness and fault tolerance", "Flexibility", "Collective computation", "All of the above", "4"],
["Artificial neural network used for", "Pattern Recognition", "Classification", "Clustering", "All of these", "4"],
["Pattern storage problem which cannot be represented by a feedback network of given size can be called as?", "Hard problem", "Easy problem", "No such problem exists", "None of the above", "1"],
["A Neural Network can answer", "what-if questions", "IF The Else Analysis Questions", "For Loop questions", "None of these", "1"],
["In neural how can connectons between different layers be achieved?", "Interlayer", "Intralayer", "Both", "None of the above", "3"],
["Correlation learning law is what type of learning?", "Supervised", "Unsupervised", "Either supervised or unsupervised", "Both supervised and unsupervised", "1"],
["What LTM corresponds to?", "Activation state of network", "Encoded pattern information pattern in synaptic weights", "Either way", "Both way", "2"],
["What is the another name of weight update rule in adaline model based on its functionality?", "LMS error learning law", "Gradient descent algorithm", "Both LMS error & gradient descent learning law", "None of the mentioned", "3"],
["Ability to learn how to do tasks based on the data given for training or initial experience", "Robustness", "Adaptive Learning", "Fault tolerance", "Self Organization", "2"],
["The number of patterns that can be stored in a given network depends on?", "Strength of connecting links", "Number of units", "Both number of units and strength of connecting links", "None of the above", "3"],
["When are stable states reached in energy landscapes, that can be used to store input patterns?", "Mean of peaks and valleys", "Maxima", "Minima", "None of the above", "3"],
["How hard problem can be solved?", "Nothing can be done", "By providing additional units in a feedback network", "By removing units in hidden layer", "None of the above", "2"],
["In hopfield model with symmetric weights, network can move to?", "Lower", "Higher", "Lower or higher", "Lower or same", "4"],
["For symmetric weights there exist?", "False wells", "Fluctuations in energy landscape", "Basins of attraction corresponding to energy maximum", "Basins of attraction corresponding to energy minimum", "4"],
["What is asynchronous update in hopfield model?", "A unit is selected at random and its new state is computed", "A predefined unit is selected and its new state is computed", "All units are updated simultaneously", "None of the above", "1"],
["What is gradient descent?", "Method to find the absolute minimum of a function", "Method to find the absolute maximum of a function", "Maximum or minimum, depends on the situation", "None of the mentioned", "1"]];

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
} 

shuffle(questions);