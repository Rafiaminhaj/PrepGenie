export const mlQuestions = {
  "Machine Learning Basics": {
    "Easy": [
      {
        "q": "What is Machine Learning?",
        "a": [
          "A database engine",
          "A type of AI that learns from data",
          "A hardcoded program",
          "A web framework"
        ],
        "c": 1,
        "exp": "ML is a subset of AI that focuses on data-driven learning."
      },
      {
        "q": "Which of these is a Supervised Learning algorithm?",
        "a": [
          "K-Means",
          "Apriori",
          "PCA",
          "Linear Regression"
        ],
        "c": 3,
        "exp": "Linear Regression uses labeled data, making it supervised."
      },
      {
        "q": "What is overfitting?",
        "a": [
          "Model performs well on training data but poorly on unseen data",
          "Model performs poorly on both",
          "Model requires more RAM",
          "Model is too simple"
        ],
        "c": 0,
        "exp": "Overfitting happens when a model learns the noise in the training data."
      },
      {
        "q": "What is unsupervised learning?",
        "a": [
          "Learning with labels",
          "Learning from teachers",
          "Learning without labels",
          "Learning with rewards"
        ],
        "c": 2,
        "exp": "Unsupervised learning finds hidden patterns in unlabeled data."
      },
      {
        "q": "Which algorithm is used for clustering?",
        "a": [
          "K-Means",
          "Linear Regression",
          "Decision Tree",
          "Naive Bayes"
        ],
        "c": 0,
        "exp": "K-Means is a popular unsupervised clustering algorithm."
      },
      {
        "q": "What is a dataset?",
        "a": [
          "A programming language",
          "A collection of data used for training",
          "A single file",
          "A database server"
        ],
        "c": 1,
        "exp": "A dataset is the foundation of any ML model training."
      },
      {
        "q": "What does 'train' mean in ML?",
        "a": [
          "To test the UI",
          "To feed data to an algorithm so it can learn",
          "To deploy the app",
          "To write code"
        ],
        "c": 1,
        "exp": "Training is the process of teaching the model."
      },
      {
        "q": "What is the target variable?",
        "a": [
          "The ID column",
          "The variable we want to predict",
          "The missing data",
          "The input"
        ],
        "c": 1,
        "exp": "The target is the output or label to be predicted."
      },
      {
        "q": "What is an outlier?",
        "a": [
          "A normal data point",
          "A data point that differs significantly from others",
          "A column name",
          "A missing value"
        ],
        "c": 1,
        "exp": "Outliers can skew ML models and are often removed."
      },
      {
        "q": "Which Python library is famous for ML?",
        "a": [
          "Scikit-Learn",
          "React",
          "Flask",
          "Django"
        ],
        "c": 0,
        "exp": "Scikit-Learn provides robust ML algorithms in Python."
      }
    ],
    "Medium": [
      {
        "q": "What does a cost function do?",
        "a": [
          "Optimizes the database",
          "Generates random weights",
          "Calculates server costs",
          "Measures how wrong the model is"
        ],
        "c": 3,
        "exp": "Cost function measures the error between predicted and actual values."
      },
      {
        "q": "What is the difference between classification and regression?",
        "a": [
          "Classification predicts discrete labels, Regression predicts continuous values",
          "They are the same",
          "Classification predicts continuous values, Regression predicts discrete labels",
          "Regression is for images"
        ],
        "c": 0,
        "exp": "Classification is for categories, Regression is for numbers."
      },
      {
        "q": "What is K-Fold Cross Validation?",
        "a": [
          "A deep learning optimizer",
          "A clustering method",
          "Multiplying features by K",
          "Splitting data into K subsets to train and test repeatedly"
        ],
        "c": 3,
        "exp": "It ensures the model's robustness by validating on different data splits."
      },
      {
        "q": "What is a Confusion Matrix?",
        "a": [
          "A database schema",
          "A deep learning layer",
          "A matrix of random numbers",
          "A table used to evaluate classification models"
        ],
        "c": 3,
        "exp": "It shows True Positives, False Positives, etc."
      },
      {
        "q": "What does PCA stand for?",
        "a": [
          "Python Code Analyzer",
          "Primary Component Algorithm",
          "Principal Component Analysis",
          "Predictive Cost Analysis"
        ],
        "c": 2,
        "exp": "PCA is a technique for dimensionality reduction."
      },
      {
        "q": "Which is an ensemble method?",
        "a": [
          "Decision Tree",
          "Logistic Regression",
          "Linear Regression",
          "Random Forest"
        ],
        "c": 3,
        "exp": "Random Forest builds multiple trees and merges them."
      },
      {
        "q": "What is precision in classification?",
        "a": [
          "Total correct answers",
          "True Positives / Total Actual",
          "True Positives / (True Positives + False Positives)",
          "False Positives / Total"
        ],
        "c": 2,
        "exp": "Precision measures exactness of the positive predictions."
      },
      {
        "q": "What is recall?",
        "a": [
          "Data loading speed",
          "Model memory",
          "Total accurate predictions",
          "True Positives / (True Positives + False Negatives)"
        ],
        "c": 3,
        "exp": "Recall measures the model's ability to find all positive instances."
      },
      {
        "q": "What is a decision boundary?",
        "a": [
          "The maximum tree depth",
          "A line that separates classes in feature space",
          "The final epoch",
          "A database limit"
        ],
        "c": 1,
        "exp": "Classifiers create decision boundaries to separate data."
      },
      {
        "q": "What is feature engineering?",
        "a": [
          "Creating or transforming features to improve model performance",
          "Writing backend code",
          "Scaling servers",
          "Deleting columns"
        ],
        "c": 0,
        "exp": "It extracts more useful information from raw data."
      }
    ],
    "Hard": [
      {
        "q": "What is the Bias-Variance Tradeoff?",
        "a": [
          "A regularization technique",
          "High bias causes underfitting, high variance causes overfitting",
          "Balancing CPU and GPU",
          "Choosing between memory and speed"
        ],
        "c": 1,
        "exp": "It is the central problem in supervised learning to minimize both errors."
      },
      {
        "q": "How does L1 Regularization (Lasso) differ from L2 (Ridge)?",
        "a": [
          "L1 adds squared magnitude, L2 adds absolute",
          "L2 is obsolete",
          "L1 is only for neural networks",
          "L1 can shrink weights to exactly zero, performing feature selection"
        ],
        "c": 3,
        "exp": "L1 creates sparse models by pushing less important feature weights to 0."
      },
      {
        "q": "What is an SVM Kernel?",
        "a": [
          "A function that maps data to a higher dimension to find a linear separator",
          "A random weight initializer",
          "The core processor",
          "An activation function"
        ],
        "c": 0,
        "exp": "The kernel trick allows SVM to solve non-linear classification problems."
      },
      {
        "q": "What is Gradient Descent?",
        "a": [
          "A neural network layer",
          "A way to sort data",
          "An optimization algorithm to minimize the loss function",
          "A clustering method"
        ],
        "c": 2,
        "exp": "It takes steps proportional to the negative of the gradient."
      },
      {
        "q": "What is the curse of dimensionality?",
        "a": [
          "When the model takes too long to train",
          "As feature space increases, data becomes sparse and models perform poorly",
          "When tensors exceed RAM",
          "A syntax error"
        ],
        "c": 1,
        "exp": "High dimensions require exponentially more data."
      },
      {
        "q": "What is a Markov Decision Process (MDP)?",
        "a": [
          "A math framework for Reinforcement Learning",
          "A sorting algorithm",
          "A database query",
          "A type of CNN"
        ],
        "c": 0,
        "exp": "MDP models decision making where outcomes are partly random."
      },
      {
        "q": "What is XG Boost?",
        "a": [
          "An optimized distributed gradient boosting library",
          "A Python keyword",
          "A graphics card",
          "A web server"
        ],
        "c": 0,
        "exp": "XGBoost is highly efficient and wins many Kaggle competitions."
      },
      {
        "q": "What is the F1 Score?",
        "a": [
          "The learning rate",
          "The harmonic mean of precision and recall",
          "A racing game metric",
          "The total accuracy"
        ],
        "c": 1,
        "exp": "F1 score balances precision and recall for imbalanced data."
      },
      {
        "q": "How do Support Vector Machines work?",
        "a": [
          "By building trees",
          "By clustering means",
          "By counting probabilities",
          "By finding the hyperplane that maximizes the margin between classes"
        ],
        "c": 3,
        "exp": "SVM aims to find the maximum margin hyperplane."
      },
      {
        "q": "What is Naive about Naive Bayes?",
        "a": [
          "It assumes all features are independent of each other",
          "It is easy to code",
          "It only works on numbers",
          "It doesn't use math"
        ],
        "c": 0,
        "exp": "The 'naive' assumption is conditional independence."
      }
    ]
  },
  "Deep Learning & Neural Networks": {
    "Easy": [
      {
        "q": "What is a Neural Network modeled after?",
        "a": [
          "The human brain",
          "A relational database",
          "A CPU architecture",
          "A binary tree"
        ],
        "c": 0,
        "exp": "Neural networks are inspired by biological neurons."
      },
      {
        "q": "What is an Epoch in training?",
        "a": [
          "A loss metric",
          "One complete pass of the training dataset through the algorithm",
          "A type of layer",
          "An activation function"
        ],
        "c": 1,
        "exp": "An epoch means the model has seen the entire dataset once."
      },
      {
        "q": "Which layer takes the initial data?",
        "a": [
          "Input Layer",
          "Dense Layer",
          "Output Layer",
          "Hidden Layer"
        ],
        "c": 0,
        "exp": "The input layer receives the raw data."
      },
      {
        "q": "What are hidden layers?",
        "a": [
          "Layers between input and output that do the computation",
          "Secure data storage",
          "Layers invisible in the code",
          "Error logs"
        ],
        "c": 0,
        "exp": "Hidden layers extract features and perform transformations."
      },
      {
        "q": "What is a weight in a neural network?",
        "a": [
          "A parameter that transforms input data",
          "The number of epochs",
          "The size of the model",
          "The batch size"
        ],
        "c": 0,
        "exp": "Weights determine the strength of the connection between neurons."
      },
      {
        "q": "What does a neuron do?",
        "a": [
          "Connects to WiFi",
          "Stores files",
          "Deletes data",
          "Takes inputs, multiplies by weights, adds bias, and passes through activation"
        ],
        "c": 3,
        "exp": "Neurons are the fundamental compute units of a neural net."
      },
      {
        "q": "What is Deep Learning?",
        "a": [
          "Learning underwater",
          "Machine learning using neural networks with many layers",
          "Reading long books",
          "A new programming language"
        ],
        "c": 1,
        "exp": "Deep refers to the many hidden layers in the network."
      },
      {
        "q": "Which library is famous for Deep Learning?",
        "a": [
          "React",
          "Express",
          "TensorFlow",
          "Pandas"
        ],
        "c": 2,
        "exp": "TensorFlow and PyTorch are the industry standards."
      },
      {
        "q": "What is a bias in a neural network?",
        "a": [
          "An extra parameter added to the weighted sum",
          "The learning rate",
          "Unfair data",
          "A bug in the code"
        ],
        "c": 0,
        "exp": "Bias shifts the activation function to fit the data better."
      },
      {
        "q": "What is training data?",
        "a": [
          "Corrupted data",
          "Data the model learns from",
          "Data used to evaluate the model",
          "Random numbers"
        ],
        "c": 1,
        "exp": "Training data is used to optimize weights."
      }
    ],
    "Medium": [
      {
        "q": "What does CNN stand for?",
        "a": [
          "Centralized Neural Node",
          "Coded Network Notation",
          "Computer Node Network",
          "Convolutional Neural Network"
        ],
        "c": 3,
        "exp": "CNNs are highly effective for image processing."
      },
      {
        "q": "What is the purpose of an Activation Function?",
        "a": [
          "To compile the code",
          "To store data in memory",
          "To normalize pixels",
          "To introduce non-linearity into the network"
        ],
        "c": 3,
        "exp": "Without non-linearity, a neural network is just a linear regression model."
      },
      {
        "q": "What is Backpropagation?",
        "a": [
          "An algorithm to calculate the gradient of the loss function with respect to weights",
          "A pooling operation",
          "A type of recurrent network",
          "Propagating data forward"
        ],
        "c": 0,
        "exp": "Backprop distributes the error backwards to update weights."
      },
      {
        "q": "What does a pooling layer do in a CNN?",
        "a": [
          "Adds color",
          "Reduces spatial dimensions (downsampling)",
          "Changes the loss function",
          "Increases dimensions"
        ],
        "c": 1,
        "exp": "Pooling reduces the number of parameters and computation."
      },
      {
        "q": "What is an RNN used for?",
        "a": [
          "Image recognition",
          "Database indexing",
          "Sequential data like text or time series",
          "Sorting arrays"
        ],
        "c": 2,
        "exp": "Recurrent Neural Networks have memory for sequence data."
      },
      {
        "q": "What is the learning rate?",
        "a": [
          "The step size taken during gradient descent",
          "The number of layers",
          "The accuracy score",
          "The speed of the CPU"
        ],
        "c": 0,
        "exp": "A learning rate too high diverges; too low takes forever."
      },
      {
        "q": "What is Batch Normalization?",
        "a": [
          "Normalizing databases",
          "A loss metric",
          "Normalizing inputs of each layer to stabilize and accelerate training",
          "A type of layer for images only"
        ],
        "c": 2,
        "exp": "Batch Norm reduces internal covariate shift."
      },
      {
        "q": "What is a tensor?",
        "a": [
          "An optimizer",
          "A network protocol",
          "A multi-dimensional array of numbers",
          "A type of CPU"
        ],
        "c": 2,
        "exp": "Tensors are the core data structures in deep learning."
      },
      {
        "q": "What is Softmax?",
        "a": [
          "An activation function that outputs a probability distribution",
          "A soft max-pooling",
          "A loss function",
          "A regularization technique"
        ],
        "c": 0,
        "exp": "Softmax is usually used in the final layer of multi-class classification."
      },
      {
        "q": "What is transfer learning?",
        "a": [
          "Using a pre-trained model as a starting point for a new task",
          "Learning across multiple CPUs",
          "A clustering method",
          "Transferring data over FTP"
        ],
        "c": 0,
        "exp": "Transfer learning saves massive amounts of time and data."
      }
    ],
    "Hard": [
      {
        "q": "What is the Vanishing Gradient Problem?",
        "a": [
          "The dataset disappears from RAM",
          "Gradients become vanishingly small, stopping earlier layers from learning",
          "The GPU overheats",
          "Gradients become too large and explode"
        ],
        "c": 1,
        "exp": "Common in deep networks using Sigmoid/Tanh, hindering backprop."
      },
      {
        "q": "Why is ReLU preferred over Sigmoid in hidden layers?",
        "a": [
          "It's a linear function",
          "It does not saturate in the positive region, mitigating vanishing gradients",
          "It prevents exploding gradients",
          "It outputs negative probabilities"
        ],
        "c": 1,
        "exp": "ReLU (max(0, x)) allows faster and more robust convergence."
      },
      {
        "q": "What is the role of Dropout?",
        "a": [
          "To delete the database",
          "A regularization technique that randomly ignores neurons during training to prevent overfitting",
          "To stop the training loop",
          "To drop unused variables"
        ],
        "c": 1,
        "exp": "Dropout forces the network to learn redundant representations."
      },
      {
        "q": "How does an LSTM solve the vanishing gradient problem?",
        "a": [
          "By removing hidden layers",
          "By scaling data",
          "Using a cell state and gating mechanisms (forget, input, output gates)",
          "By using ReLU"
        ],
        "c": 2,
        "exp": "LSTMs maintain a constant error flow through the cell state."
      },
      {
        "q": "What is an Autoencoder?",
        "a": [
          "A type of CNN",
          "A self-driving car algorithm",
          "An unsupervised network that learns to compress and reconstruct data",
          "An optimization algorithm"
        ],
        "c": 2,
        "exp": "Autoencoders are used for dimensionality reduction and anomaly detection."
      },
      {
        "q": "What is a GAN (Generative Adversarial Network)?",
        "a": [
          "A global area network",
          "Two networks (generator and discriminator) competing against each other",
          "A network that plays chess",
          "A text generation model"
        ],
        "c": 1,
        "exp": "GANs generate highly realistic synthetic data."
      },
      {
        "q": "What is the purpose of the Adam optimizer?",
        "a": [
          "To combine momentum and RMSprop for adaptive learning rates",
          "To increase the batch size",
          "To create human-like AI",
          "To initialize weights"
        ],
        "c": 0,
        "exp": "Adam is currently the most popular optimization algorithm."
      },
      {
        "q": "What is Weight Decay?",
        "a": [
          "A hardware failure",
          "When the model forgets",
          "A pooling strategy",
          "A regularization term (L2) added to the loss to penalize large weights"
        ],
        "c": 3,
        "exp": "Weight decay prevents overfitting by keeping weights small."
      },
      {
        "q": "What is a Residual Network (ResNet)?",
        "a": [
          "A network with skip connections to allow gradients to flow directly",
          "A recurrent network",
          "A shallow network",
          "A network that resides in memory"
        ],
        "c": 0,
        "exp": "Skip connections allow training of extremely deep networks (100+ layers)."
      },
      {
        "q": "What is Cross-Entropy Loss?",
        "a": [
          "A loss function used for regression",
          "A regularization term",
          "An activation function",
          "A loss function used for classification tasks to measure probability divergence"
        ],
        "c": 3,
        "exp": "Cross-entropy measures the distance between two probability distributions."
      }
    ]
  },
  "Generative AI & LLMs": {
    "Easy": [
      {
        "q": "What does LLM stand for?",
        "a": [
          "Linear Learning Method",
          "Large Language Model",
          "Linked List Module",
          "Local Logic Machine"
        ],
        "c": 1,
        "exp": "LLMs are massive AI models trained on text."
      },
      {
        "q": "Which architecture powers ChatGPT?",
        "a": [
          "Transformer",
          "RNN",
          "LSTM",
          "CNN"
        ],
        "c": 0,
        "exp": "Transformers revolutionized NLP and power modern LLMs."
      },
      {
        "q": "What is a 'Prompt'?",
        "a": [
          "A Python library",
          "A database query",
          "A command line interface",
          "The text instruction given to an AI model"
        ],
        "c": 3,
        "exp": "Prompts guide the generation output of the LLM."
      },
      {
        "q": "What is Generative AI?",
        "a": [
          "AI that only classifies images",
          "AI that manages databases",
          "AI that tests code",
          "AI that generates new content (text, images, audio)"
        ],
        "c": 3,
        "exp": "Generative AI creates novel data rather than just analyzing it."
      },
      {
        "q": "Who created ChatGPT?",
        "a": [
          "Microsoft",
          "OpenAI",
          "Google",
          "Meta"
        ],
        "c": 1,
        "exp": "OpenAI developed the GPT series."
      },
      {
        "q": "What does GPT stand for?",
        "a": [
          "Global Processing Tool",
          "Graphics Processing Tensor",
          "General Purpose Tech",
          "Generative Pre-trained Transformer"
        ],
        "c": 3,
        "exp": "GPT is the foundation of many modern language models."
      },
      {
        "q": "Can LLMs generate images directly?",
        "a": [
          "No, they generate text",
          "Only in Python",
          "Yes",
          "Only on mobile"
        ],
        "c": 0,
        "exp": "LLMs generate text; diffusion models generate images."
      },
      {
        "q": "What is a chatbot?",
        "a": [
          "A database schema",
          "A software application designed to simulate human conversation",
          "A robot that builds things",
          "A network switch"
        ],
        "c": 1,
        "exp": "ChatGPT is a highly advanced chatbot."
      },
      {
        "q": "Are LLMs always factually correct?",
        "a": [
          "No, they can hallucinate",
          "Only on Tuesdays",
          "Yes",
          "Yes, they search the web perfectly"
        ],
        "c": 0,
        "exp": "LLMs predict the next word, so they can invent facts."
      },
      {
        "q": "What is zero-shot learning?",
        "a": [
          "A syntax error",
          "Deleting the model",
          "Asking a model to perform a task it wasn't explicitly trained on, without examples",
          "Learning with zero data"
        ],
        "c": 2,
        "exp": "Zero-shot means giving a prompt with no prior examples."
      }
    ],
    "Medium": [
      {
        "q": "What is RAG in Generative AI?",
        "a": [
          "Real-time AI Graphics",
          "Retrieval-Augmented Generation",
          "Random Access Generation",
          "Recursive Algorithm Group"
        ],
        "c": 1,
        "exp": "RAG combines search retrieval with LLM generation to reduce hallucinations."
      },
      {
        "q": "What is a 'Token' in NLP?",
        "a": [
          "A Bitcoin",
          "A server session",
          "A piece of a word or character used as the base unit for processing",
          "A password"
        ],
        "c": 2,
        "exp": "LLMs process text in chunks called tokens."
      },
      {
        "q": "What is 'Hallucination' in LLMs?",
        "a": [
          "A feature of image generation",
          "When the server crashes",
          "When the AI confidently generates false or nonsensical information",
          "When the AI sees images"
        ],
        "c": 2,
        "exp": "Hallucinations occur because LLMs predict next words, not absolute facts."
      },
      {
        "q": "What is Few-Shot Prompting?",
        "a": [
          "Providing a few examples in the prompt to guide the model",
          "Taking photos",
          "A model compression technique",
          "Limiting the output to a few words"
        ],
        "c": 0,
        "exp": "Providing examples helps the model understand the desired output format."
      },
      {
        "q": "What is context window?",
        "a": [
          "The number of parameters",
          "The maximum number of tokens the model can process at one time",
          "The training time",
          "The UI window size"
        ],
        "c": 1,
        "exp": "Context window limits how much text you can send and receive."
      },
      {
        "q": "What is temperature in LLM generation?",
        "a": [
          "Hardware heat",
          "A parameter controlling the randomness of predictions",
          "The token cost",
          "The speed of response"
        ],
        "c": 1,
        "exp": "Higher temperature = more random/creative; Lower = more deterministic."
      },
      {
        "q": "What are embeddings?",
        "a": [
          "Vector representations of text that capture semantic meaning",
          "HTML tags",
          "Database tables",
          "Model weights"
        ],
        "c": 0,
        "exp": "Embeddings map text to numbers for vector search and AI understanding."
      },
      {
        "q": "What is LangChain?",
        "a": [
          "A new language",
          "A blockchain",
          "A framework for developing applications powered by LLMs",
          "A vector database"
        ],
        "c": 2,
        "exp": "LangChain simplifies building agents and RAG pipelines."
      },
      {
        "q": "What is a Vector Database?",
        "a": [
          "A database optimized for storing and querying high-dimensional vectors (embeddings)",
          "A cache",
          "A graph database",
          "A SQL database"
        ],
        "c": 0,
        "exp": "Pinecone, Milvus, and Supabase pgvector are examples."
      },
      {
        "q": "What is Fine-Tuning?",
        "a": [
          "Training a pre-trained model further on a specific dataset",
          "Increasing the context window",
          "Adjusting the screen brightness",
          "Writing a better prompt"
        ],
        "c": 0,
        "exp": "Fine-tuning updates the model's internal weights for specific tasks."
      }
    ],
    "Hard": [
      {
        "q": "What is the Self-Attention mechanism in Transformers?",
        "a": [
          "It makes the model self-aware",
          "It allows the model to look at other words in the input sequence to better understand context",
          "It monitors GPU usage",
          "It drops random neurons"
        ],
        "c": 1,
        "exp": "Self-attention computes a weighted representation of all words in a sentence."
      },
      {
        "q": "What is LoRA (Low-Rank Adaptation)?",
        "a": [
          "A tokenization algorithm",
          "A wireless protocol",
          "A technique to fine-tune large models efficiently by freezing original weights and injecting trainable rank decomposition matrices",
          "A loss function"
        ],
        "c": 2,
        "exp": "LoRA enables fine-tuning of massive LLMs on consumer hardware."
      },
      {
        "q": "What is the purpose of RLHF?",
        "a": [
          "Reinforcement Learning from Human Feedback to align model outputs with human preferences",
          "A new Transformer block",
          "Real-time Logging for High Frequency",
          "Routing Layer for Hardware"
        ],
        "c": 0,
        "exp": "RLHF makes models like ChatGPT safer and more conversational."
      },
      {
        "q": "What is KV Caching?",
        "a": [
          "Caching Key and Value vectors in Transformers to speed up autoregressive decoding",
          "A memory leak",
          "A Redis technique",
          "Key-Value database"
        ],
        "c": 0,
        "exp": "KV cache prevents re-computing past tokens during text generation."
      },
      {
        "q": "What is Speculative Decoding?",
        "a": [
          "A cryptography method",
          "A translation error",
          "Using a smaller model to draft tokens quickly, verified by a larger model to speed up inference",
          "Guessing the user prompt"
        ],
        "c": 2,
        "exp": "Speculative decoding drastically improves LLM inference speed."
      },
      {
        "q": "What is Rotary Positional Embedding (RoPE)?",
        "a": [
          "A clustering algorithm",
          "A physical motor",
          "A NLP library",
          "An embedding method that encodes absolute position with a rotation matrix to improve relative positional understanding"
        ],
        "c": 3,
        "exp": "RoPE is used in models like LLaMA for better long-context performance."
      },
      {
        "q": "What is DPO (Direct Preference Optimization)?",
        "a": [
          "A database optimization",
          "A GPU scheduler",
          "An alternative to RLHF that optimizes policies directly on preference data without a reward model",
          "A prompt engineering technique"
        ],
        "c": 2,
        "exp": "DPO simplifies alignment by removing the need for a separate reward model."
      },
      {
        "q": "What does Mixture of Experts (MoE) do?",
        "a": [
          "A cloud architecture",
          "Hires consultants",
          "A data augmentation method",
          "Routes tokens to specialized smaller subnetworks (experts) to increase capacity without increasing inference compute"
        ],
        "c": 3,
        "exp": "MoE allows scaling to trillions of parameters efficiently (e.g., GPT-4)."
      },
      {
        "q": "What is perplexity in language models?",
        "a": [
          "The model's memory usage",
          "A measurement of how well a probability model predicts a sample",
          "How confused the user is",
          "The token count"
        ],
        "c": 1,
        "exp": "Lower perplexity means the model is better at predicting the text."
      },
      {
        "q": "What is the FlashAttention algorithm?",
        "a": [
          "An IO-aware exact attention algorithm that reduces memory reads/writes to speed up transformers",
          "A frontend UI trick",
          "A caching strategy",
          "An attention deficit"
        ],
        "c": 0,
        "exp": "FlashAttention enables models to handle much larger context windows efficiently."
      }
    ]
  },
  "Data Processing": {
    "Easy": [
      {
        "q": "What is Data Cleaning?",
        "a": [
          "Fixing or removing incorrect, corrupted, or incomplete data within a dataset",
          "Deleting all data",
          "Writing SQL queries",
          "Formatting hard drives"
        ],
        "c": 0,
        "exp": "Cleaning is the first step in the data pipeline."
      },
      {
        "q": "What is a NaN value?",
        "a": [
          "New Artificial Node",
          "Negative Array Number",
          "Not a Network",
          "Not a Number, representing missing or undefined data"
        ],
        "c": 3,
        "exp": "NaN is standard for missing numerical data in Pandas/Numpy."
      },
      {
        "q": "Which library is most commonly used for Data Processing in Python?",
        "a": [
          "Django",
          "Pandas",
          "Flask",
          "React"
        ],
        "c": 1,
        "exp": "Pandas is the standard for data manipulation in Python."
      },
      {
        "q": "What is a DataFrame?",
        "a": [
          "A CPU register",
          "A network packet",
          "A 2-dimensional labeled data structure with columns of potentially different types",
          "A picture frame"
        ],
        "c": 2,
        "exp": "DataFrames are essentially tables, like Excel sheets in Python."
      },
      {
        "q": "What is CSV?",
        "a": [
          "Comma Separated Values",
          "Computer Screen View",
          "Code Syntax Validator",
          "Central Server Volume"
        ],
        "c": 0,
        "exp": "CSV is a very common plain-text data format."
      },
      {
        "q": "What does SQL stand for?",
        "a": [
          "Server Query Link",
          "Simple Question Logic",
          "Structured Query Language",
          "Standard Quality Level"
        ],
        "c": 2,
        "exp": "SQL is used for processing relational data."
      },
      {
        "q": "What is raw data?",
        "a": [
          "Encrypted data",
          "Data that has not been processed for use",
          "Cooked data",
          "Deleted data"
        ],
        "c": 1,
        "exp": "Raw data is directly from the source."
      },
      {
        "q": "What is data visualization?",
        "a": [
          "A virtual reality game",
          "A database structure",
          "Looking at numbers",
          "Graphical representation of information and data"
        ],
        "c": 3,
        "exp": "Charts and graphs are data visualizations."
      },
      {
        "q": "Which of these is a Python data visualization library?",
        "a": [
          "Express",
          "Spring",
          "Matplotlib",
          "NumPy"
        ],
        "c": 2,
        "exp": "Matplotlib and Seaborn are standard plotting libraries."
      },
      {
        "q": "What is an index in a database?",
        "a": [
          "A book chapter",
          "A syntax rule",
          "A data structure that improves the speed of data retrieval operations",
          "The final row"
        ],
        "c": 2,
        "exp": "Indexes make lookups significantly faster."
      }
    ],
    "Medium": [
      {
        "q": "What is Feature Scaling?",
        "a": [
          "Standardizing the range of independent variables or features of data",
          "Changing the font size",
          "Adding more servers",
          "Removing columns"
        ],
        "c": 0,
        "exp": "Scaling ensures no single feature dominates due to magnitude."
      },
      {
        "q": "What is One-Hot Encoding?",
        "a": [
          "A cooling system",
          "A hashing algorithm",
          "Compressing files",
          "Converting categorical variables into a form that could be provided to ML algorithms"
        ],
        "c": 3,
        "exp": "It creates binary columns for each category."
      },
      {
        "q": "How can you handle missing data (Imputation)?",
        "a": [
          "By throwing an error",
          "Replacing missing values with the mean, median, or mode",
          "Reversing the array",
          "Encrypting it"
        ],
        "c": 1,
        "exp": "Imputation preserves dataset size by guessing missing values."
      },
      {
        "q": "What is ETL?",
        "a": [
          "Extra Time Left",
          "Estimate To Live",
          "Extract, Transform, Load",
          "Execute Test Logic"
        ],
        "c": 2,
        "exp": "ETL is the standard pipeline for data warehousing."
      },
      {
        "q": "What is an inner join?",
        "a": [
          "Returns records that have matching values in both tables",
          "Returns nothing",
          "Combines databases",
          "Returns all rows"
        ],
        "c": 0,
        "exp": "Inner joins only keep intersecting records."
      },
      {
        "q": "What is time series data?",
        "a": [
          "Random data",
          "String data",
          "Data points indexed in time order",
          "Data about watches"
        ],
        "c": 2,
        "exp": "Time series analysis is crucial for forecasting."
      },
      {
        "q": "What is data wrangling?",
        "a": [
          "Deleting data",
          "Encrypting data",
          "Fighting with data",
          "The process of cleaning and unifying messy and complex data sets for easy access and analysis"
        ],
        "c": 3,
        "exp": "Wrangling is another term for data preparation."
      },
      {
        "q": "What does standard deviation measure?",
        "a": [
          "Average value",
          "The amount of variation or dispersion of a set of values",
          "The sum",
          "The median"
        ],
        "c": 1,
        "exp": "High standard deviation means values are spread out."
      },
      {
        "q": "What is the difference between structured and unstructured data?",
        "a": [
          "Structured is faster",
          "They are the same",
          "Unstructured is illegal",
          "Structured data has a defined schema (like SQL); Unstructured doesn't (like images/text)"
        ],
        "c": 3,
        "exp": "Unstructured data requires more complex ML models to parse."
      },
      {
        "q": "What is Web Scraping?",
        "a": [
          "Cleaning a screen",
          "Automated extraction of data from websites",
          "Deleting web history",
          "Building a website"
        ],
        "c": 1,
        "exp": "Scraping is a common method for data collection."
      }
    ],
    "Hard": [
      {
        "q": "What is SMOTE used for?",
        "a": [
          "Database indexing",
          "A sorting algorithm",
          "Deleting files securely",
          "Synthetic Minority Over-sampling Technique, used to handle imbalanced datasets"
        ],
        "c": 3,
        "exp": "SMOTE generates synthetic examples of the minority class."
      },
      {
        "q": "What is the difference between Normalization and Standardization?",
        "a": [
          "Standardization is only for text",
          "Normalization removes outliers",
          "They are identical",
          "Normalization scales to [0,1], Standardization scales to mean 0 and variance 1"
        ],
        "c": 3,
        "exp": "Different algorithms require different scaling strategies."
      },
      {
        "q": "What is PCA (Principal Component Analysis)?",
        "a": [
          "A classification algorithm",
          "A dimensionality reduction technique that transforms data into linearly uncorrelated variables",
          "A data scraping tool",
          "A security protocol"
        ],
        "c": 1,
        "exp": "PCA reduces features while retaining the most variance in data."
      },
      {
        "q": "What is a MapReduce operation?",
        "a": [
          "A programming model for processing large data sets with a parallel, distributed algorithm",
          "A database schema",
          "An ML optimizer",
          "A mapping app"
        ],
        "c": 0,
        "exp": "MapReduce revolutionized Big Data processing (Hadoop)."
      },
      {
        "q": "What is data leakage in ML?",
        "a": [
          "When RAM is full",
          "When data is hacked",
          "When information from outside the training dataset is used to create the model",
          "When models are deleted"
        ],
        "c": 2,
        "exp": "Leakage leads to overly optimistic models that fail in production."
      },
      {
        "q": "What is TF-IDF?",
        "a": [
          "A military force",
          "A database engine",
          "Term Frequency-Inverse Document Frequency, a numerical statistic reflecting word importance to a document",
          "A sorting method"
        ],
        "c": 2,
        "exp": "TF-IDF is a classic NLP processing technique."
      },
      {
        "q": "What is Apache Spark?",
        "a": [
          "A Python library",
          "A web server",
          "An electrical component",
          "A unified analytics engine for large-scale data processing"
        ],
        "c": 3,
        "exp": "Spark replaced Hadoop MapReduce due to its in-memory speed."
      },
      {
        "q": "What is a data lake?",
        "a": [
          "A body of water",
          "A structured database",
          "A system that holds a vast amount of raw data in its native format",
          "A server cluster"
        ],
        "c": 2,
        "exp": "Data lakes store everything; Data warehouses store processed data."
      },
      {
        "q": "What is Heteroscedasticity?",
        "a": [
          "A neural network layer",
          "A sorting algorithm",
          "A biological term",
          "When the variability of a variable is unequal across the range of values of a second variable"
        ],
        "c": 3,
        "exp": "It violates assumptions of linear regression models."
      },
      {
        "q": "What is the Parquet file format?",
        "a": [
          "A column-oriented data file format designed for efficient data storage and retrieval",
          "An audio file",
          "A video codec",
          "A flooring type"
        ],
        "c": 0,
        "exp": "Parquet is highly optimized for Big Data query engines."
      }
    ]
  }
};
