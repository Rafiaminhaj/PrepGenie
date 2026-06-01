export const mlQuestions = {
  "Machine Learning Basics": {
    "Easy": [
      { "q": "What is Machine Learning?", "a": ["A type of AI that learns from data", "A hardcoded program", "A database engine", "A web framework"], "c": 0, "exp": "ML is a subset of AI that focuses on data-driven learning." },
      { "q": "Which of these is a Supervised Learning algorithm?", "a": ["K-Means", "Linear Regression", "Apriori", "PCA"], "c": 1, "exp": "Linear Regression uses labeled data, making it supervised." },
      { "q": "What is overfitting?", "a": ["Model performs well on training data but poorly on unseen data", "Model performs poorly on both", "Model is too simple", "Model requires more RAM"], "c": 0, "exp": "Overfitting happens when a model learns the noise in the training data." }
    ],
    "Medium": [
      { "q": "What does a cost function do?", "a": ["Calculates server costs", "Measures how wrong the model is", "Optimizes the database", "Generates random weights"], "c": 1, "exp": "Cost function measures the error between predicted and actual values." },
      { "q": "What is the difference between classification and regression?", "a": ["Classification predicts continuous values, Regression predicts discrete labels", "Classification predicts discrete labels, Regression predicts continuous values", "They are the same", "Regression is for images"], "c": 1, "exp": "Classification is for categories, Regression is for numbers." },
      { "q": "What is K-Fold Cross Validation?", "a": ["Splitting data into K subsets to train and test repeatedly", "Multiplying features by K", "A clustering method", "A deep learning optimizer"], "c": 0, "exp": "It ensures the model's robustness by validating on different data splits." }
    ],
    "Hard": [
      { "q": "What is the Bias-Variance Tradeoff?", "a": ["Choosing between memory and speed", "High bias causes underfitting, high variance causes overfitting", "Balancing CPU and GPU", "A regularization technique"], "c": 1, "exp": "It is the central problem in supervised learning to minimize both errors." },
      { "q": "How does L1 Regularization (Lasso) differ from L2 (Ridge)?", "a": ["L1 adds squared magnitude, L2 adds absolute", "L1 can shrink weights to exactly zero, performing feature selection", "L1 is only for neural networks", "L2 is obsolete"], "c": 1, "exp": "L1 creates sparse models by pushing less important feature weights to 0." },
      { "q": "What is an SVM Kernel?", "a": ["The core processor", "A function that maps data to a higher dimension to find a linear separator", "A random weight initializer", "An activation function"], "c": 1, "exp": "The kernel trick allows SVM to solve non-linear classification problems." }
    ]
  },
  "Deep Learning & Neural Networks": {
    "Easy": [
      { "q": "What is a Neural Network modeled after?", "a": ["The human brain", "A CPU architecture", "A relational database", "A binary tree"], "c": 0, "exp": "Neural networks are inspired by biological neurons." },
      { "q": "What is an Epoch in training?", "a": ["A type of layer", "One complete pass of the training dataset through the algorithm", "A loss metric", "An activation function"], "c": 1, "exp": "An epoch means the model has seen the entire dataset once." },
      { "q": "Which layer takes the initial data?", "a": ["Hidden Layer", "Output Layer", "Input Layer", "Dense Layer"], "c": 2, "exp": "The input layer receives the raw data." }
    ],
    "Medium": [
      { "q": "What does CNN stand for?", "a": ["Convolutional Neural Network", "Computer Node Network", "Centralized Neural Node", "Coded Network Notation"], "c": 0, "exp": "CNNs are highly effective for image processing." },
      { "q": "What is the purpose of an Activation Function?", "a": ["To compile the code", "To introduce non-linearity into the network", "To store data in memory", "To normalize pixels"], "c": 1, "exp": "Without non-linearity, a neural network is just a linear regression model." },
      { "q": "What is Backpropagation?", "a": ["Propagating data forward", "An algorithm to calculate the gradient of the loss function with respect to weights", "A type of recurrent network", "A pooling operation"], "c": 1, "exp": "Backprop distributes the error backwards to update weights." }
    ],
    "Hard": [
      { "q": "What is the Vanishing Gradient Problem?", "a": ["Gradients become too large and explode", "Gradients become vanishingly small, stopping earlier layers from learning", "The dataset disappears from RAM", "The GPU overheats"], "c": 1, "exp": "Common in deep networks using Sigmoid/Tanh, hindering backprop." },
      { "q": "Why is ReLU preferred over Sigmoid in hidden layers?", "a": ["It prevents exploding gradients", "It does not saturate in the positive region, mitigating vanishing gradients", "It outputs negative probabilities", "It's a linear function"], "c": 1, "exp": "ReLU (max(0, x)) allows faster and more robust convergence." },
      { "q": "What is the role of Dropout?", "a": ["To drop unused variables", "A regularization technique that randomly ignores neurons during training to prevent overfitting", "To delete the database", "To stop the training loop"], "c": 1, "exp": "Dropout forces the network to learn redundant representations." }
    ]
  },
  "Generative AI & LLMs": {
    "Easy": [
      { "q": "What does LLM stand for?", "a": ["Large Language Model", "Local Logic Machine", "Linear Learning Method", "Linked List Module"], "c": 0, "exp": "LLMs are massive AI models trained on text." },
      { "q": "Which architecture powers ChatGPT?", "a": ["CNN", "RNN", "Transformer", "LSTM"], "c": 2, "exp": "Transformers revolutionized NLP and power modern LLMs." },
      { "q": "What is a 'Prompt'?", "a": ["A command line interface", "The text instruction given to an AI model", "A Python library", "A database query"], "c": 1, "exp": "Prompts guide the generation output of the LLM." }
    ],
    "Medium": [
      { "q": "What is RAG in Generative AI?", "a": ["Random Access Generation", "Retrieval-Augmented Generation", "Recursive Algorithm Group", "Real-time AI Graphics"], "c": 1, "exp": "RAG combines search retrieval with LLM generation to reduce hallucinations." },
      { "q": "What is a 'Token' in NLP?", "a": ["A password", "A piece of a word or character used as the base unit for processing", "A Bitcoin", "A server session"], "c": 1, "exp": "LLMs process text in chunks called tokens." },
      { "q": "What is 'Hallucination' in LLMs?", "a": ["When the AI sees images", "When the AI confidently generates false or nonsensical information", "A feature of image generation", "When the server crashes"], "c": 1, "exp": "Hallucinations occur because LLMs predict next words, not absolute facts." }
    ],
    "Hard": [
      { "q": "What is the Self-Attention mechanism in Transformers?", "a": ["It allows the model to look at other words in the input sequence to better understand context", "It makes the model self-aware", "It monitors GPU usage", "It drops random neurons"], "c": 0, "exp": "Self-attention computes a weighted representation of all words in a sentence." },
      { "q": "What is LoRA (Low-Rank Adaptation)?", "a": ["A wireless protocol", "A technique to fine-tune large models efficiently by freezing original weights and injecting trainable rank decomposition matrices", "A tokenization algorithm", "A loss function"], "c": 1, "exp": "LoRA enables fine-tuning of massive LLMs on consumer hardware." },
      { "q": "What is the purpose of RLHF?", "a": ["Real-time Logging for High Frequency", "Reinforcement Learning from Human Feedback to align model outputs with human preferences", "A new Transformer block", "Routing Layer for Hardware"], "c": 1, "exp": "RLHF makes models like ChatGPT safer and more conversational." }
    ]
  },
  "Data Processing": {
    "Easy": [
      { "q": "What is Data Cleaning?", "a": ["Deleting all data", "Fixing or removing incorrect, corrupted, or incomplete data within a dataset", "Formatting hard drives", "Writing SQL queries"], "c": 1, "exp": "Cleaning is the first step in the data pipeline." },
      { "q": "What is a NaN value?", "a": ["Not a Network", "Not a Number, representing missing or undefined data", "New Artificial Node", "Negative Array Number"], "c": 1, "exp": "NaN is standard for missing numerical data in Pandas/Numpy." },
      { "q": "Which library is most commonly used for Data Processing in Python?", "a": ["React", "Pandas", "Django", "Flask"], "c": 1, "exp": "Pandas is the standard for data manipulation in Python." }
    ],
    "Medium": [
      { "q": "What is Feature Scaling?", "a": ["Changing the font size", "Standardizing the range of independent variables or features of data", "Adding more servers", "Removing columns"], "c": 1, "exp": "Scaling ensures no single feature dominates due to magnitude." },
      { "q": "What is One-Hot Encoding?", "a": ["A cooling system", "Converting categorical variables into a form that could be provided to ML algorithms", "A hashing algorithm", "Compressing files"], "c": 1, "exp": "It creates binary columns for each category." },
      { "q": "How can you handle missing data (Imputation)?", "a": ["By throwing an error", "Replacing missing values with the mean, median, or mode", "Encrypting it", "Reversing the array"], "c": 1, "exp": "Imputation preserves dataset size by guessing missing values." }
    ],
    "Hard": [
      { "q": "What is SMOTE used for?", "a": ["Deleting files securely", "Synthetic Minority Over-sampling Technique, used to handle imbalanced datasets", "A sorting algorithm", "Database indexing"], "c": 1, "exp": "SMOTE generates synthetic examples of the minority class." },
      { "q": "What is the difference between Normalization and Standardization?", "a": ["They are identical", "Normalization scales to [0,1], Standardization scales to mean 0 and variance 1", "Standardization is only for text", "Normalization removes outliers"], "c": 1, "exp": "Different algorithms require different scaling strategies." },
      { "q": "What is PCA (Principal Component Analysis)?", "a": ["A security protocol", "A dimensionality reduction technique that transforms data into linearly uncorrelated variables", "A classification algorithm", "A data scraping tool"], "c": 1, "exp": "PCA reduces features while retaining the most variance in data." }
    ]
  }
};
