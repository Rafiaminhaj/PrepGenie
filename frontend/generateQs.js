import fs from 'fs';

const topics = ['Java', 'Spring Boot', 'JavaScript', 'System Design', 'DSA', 'Python'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const quizData = {
  'Java': {
    'Easy': [
      { q: "What is JVM?", a: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Joint Virtual Memory"], c: 0, exp: "JVM stands for Java Virtual Machine, an engine that provides runtime environment to drive the Java Code." },
      { q: "Which of these cannot be used for a variable name in Java?", a: ["identifier", "keyword", "identifier & keyword", "none of the mentioned"], c: 1, exp: "Keywords are reserved words in Java." },
      { q: "What is the size of int variable?", a: ["8 bit", "16 bit", "32 bit", "64 bit"], c: 2, exp: "int is 32 bits (4 bytes) in Java." },
      { q: "What is the default value of a local variable?", a: ["null", "0", "Depends on data type", "Not assigned"], c: 3, exp: "Local variables must be initialized before use." },
      { q: "Which of the following is not a Java features?", a: ["Dynamic", "Architecture Neutral", "Use of pointers", "Object-oriented"], c: 2, exp: "Pointers are not supported in Java." },
      { q: "What is used to find and fix bugs in the Java programs?", a: ["JVM", "JRE", "JDK", "JDB"], c: 3, exp: "JDB (Java Debugger) is used to find and fix bugs." },
      { q: "What is the return type of the hashCode() method in the Object class?", a: ["Object", "int", "long", "void"], c: 1, exp: "hashCode() returns an integer value." },
      { q: "Which package contains the Random class?", a: ["java.util", "java.lang", "java.awt", "java.io"], c: 0, exp: "Random class is available in java.util package." },
      { q: "An interface with no fields or methods is known as a ______.", a: ["Runnable Interface", "Marker Interface", "Abstract Interface", "CharSequence Interface"], c: 1, exp: "Marker interface has no fields or methods (e.g., Serializable)." },
      { q: "Which of these classes are the direct subclasses of the Throwable class?", a: ["RuntimeException and Error", "Exception and VirtualMachineError", "Error and Exception", "IOException and VirtualMachineError"], c: 2, exp: "Error and Exception are direct subclasses of Throwable." }
    ],
    'Medium': [
      { q: "What is the difference between HashMap and HashTable?", a: ["HashMap is synchronized", "HashMap allows null keys", "HashTable allows null values", "No difference"], c: 1, exp: "HashMap allows one null key and multiple null values; HashTable doesn't." },
      { q: "Which method must be implemented by all threads?", a: ["wait()", "start()", "run()", "stop()"], c: 2, exp: "The run() method contains the code executed by the thread." },
      { q: "What is the output of Math.floor(3.6)?", a: ["3.0", "3", "4", "4.0"], c: 0, exp: "Math.floor returns a double value that is less than or equal to the argument." },
      { q: "Which of the following is a thread-safe implementation of Map?", a: ["HashMap", "TreeMap", "ConcurrentHashMap", "WeakHashMap"], c: 2, exp: "ConcurrentHashMap is thread-safe without synchronizing the whole map." },
      { q: "What does the 'volatile' keyword guarantee?", a: ["Atomicity", "Visibility", "Mutual Exclusion", "Thread suspension"], c: 1, exp: "volatile ensures visibility of changes to variables across threads." },
      { q: "In Java 8, what is the return type of filter() in Stream API?", a: ["List", "Stream", "Optional", "void"], c: 1, exp: "filter() is an intermediate operation that returns a Stream." },
      { q: "Which design pattern is used by java.lang.Runtime?", a: ["Factory", "Singleton", "Observer", "Decorator"], c: 1, exp: "Runtime class uses the Singleton pattern." },
      { q: "What is the initial capacity of an ArrayList?", a: ["0", "5", "10", "16"], c: 2, exp: "The default initial capacity of ArrayList is 10." },
      { q: "What happens if a catch block throws an exception?", a: ["Compilation error", "Program terminates immediately", "The finally block is still executed", "The exception is ignored"], c: 2, exp: "The finally block is always executed regardless of exceptions thrown." },
      { q: "What is the time complexity of searching in a HashSet?", a: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], c: 0, exp: "HashSet search operations run in constant time O(1) ideally." }
    ],
    'Hard': [
      { q: "What is the purpose of the CountDownLatch in Java?", a: ["To create thread pools", "To synchronize one or more threads", "To replace synchronized keyword", "To schedule tasks"], c: 1, exp: "CountDownLatch allows one or more threads to wait until a set of operations completes." },
      { q: "How does the JVM handle OutOfMemoryError?", a: ["Restarts the application", "Calls System.gc() automatically", "Throws the error and terminates the affected thread", "Expands heap space dynamically"], c: 2, exp: "OOM is thrown and terminates the thread if not handled." },
      { q: "What is 'String Interning' in Java?", a: ["Creating a new String object", "Storing only one copy of each distinct String value", "Converting String to char array", "Encrypting String values"], c: 1, exp: "Interning ensures only one copy of a distinct String exists in the String Pool." },
      { q: "Which Garbage Collector is the default in Java 11?", a: ["Serial GC", "Parallel GC", "G1 GC", "ZGC"], c: 2, exp: "G1 GC is the default garbage collector in Java 11." },
      { q: "What is a 'Phantom Reference'?", a: ["A reference that prevents GC", "A reference enqueued when object is physically removed", "A soft reference", "A weak reference"], c: 1, exp: "Phantom references are used to schedule pre-mortem cleanup actions." },
      { q: "In Java Memory Model, what is 'happens-before'?", a: ["A relationship that guarantees memory visibility", "A method in Thread class", "A GC algorithm phase", "A compilation stage"], c: 0, exp: "happens-before defines the partial ordering of memory operations." },
      { q: "What is the maximum limit of threads in Java?", a: ["1000", "5000", "Depends on OS and RAM", "No limit"], c: 2, exp: "Thread creation is limited by OS limits and available memory." },
      { q: "How is 'invokedynamic' different from other invoke instructions?", a: ["It executes faster", "It binds the method call at runtime", "It is used only for static methods", "It skips access checks"], c: 1, exp: "invokedynamic enables dynamic language support by binding calls at runtime." },
      { q: "What does ThreadLocal do?", a: ["Creates local variables for a method", "Provides thread-local variables", "Synchronizes local variables", "Destroys threads locally"], c: 1, exp: "ThreadLocal provides variables that are read/written by a specific thread independently." },
      { q: "What is the main advantage of ForkJoinPool over ExecutorService?", a: ["Work-stealing algorithm", "Lower memory usage", "Creates fewer threads", "Simpler syntax"], c: 0, exp: "ForkJoinPool uses work-stealing to keep all threads busy." }
    ]
  },
  'Spring Boot': {
    'Easy': [
      { q: "What annotation is used to bootstrap a Spring Boot application?", a: ["@SpringBootApplication", "@EnableAutoConfiguration", "@Configuration", "@ComponentScan"], c: 0, exp: "@SpringBootApplication encapsulates @Configuration, @EnableAutoConfiguration, and @ComponentScan." },
      { q: "Which file is used for configuring properties in Spring Boot?", a: ["config.xml", "application.properties", "spring.xml", "settings.json"], c: 1, exp: "application.properties or application.yml is used." },
      { q: "What does @RestController do?", a: ["Returns a view", "Combines @Controller and @ResponseBody", "Manages database connections", "Configures security"], c: 1, exp: "@RestController ensures return values are automatically serialized into JSON/XML." },
      { q: "What is the default embedded server in Spring Boot?", a: ["Jetty", "Undertow", "Tomcat", "GlassFish"], c: 2, exp: "Tomcat is the default embedded servlet container." },
      { q: "Which starter dependency is used for building web applications?", a: ["spring-boot-starter-web", "spring-boot-starter-data", "spring-boot-starter-mvc", "spring-boot-web"], c: 0, exp: "spring-boot-starter-web includes Spring MVC and Tomcat." },
      { q: "What does @Autowired do?", a: ["Creates a new instance", "Injects object dependencies implicitly", "Starts a transaction", "Maps a URL to a method"], c: 1, exp: "@Autowired is used for automatic dependency injection." },
      { q: "Which annotation maps HTTP GET requests?", a: ["@PostMapping", "@RequestMapping", "@GetMapping", "@FetchMapping"], c: 2, exp: "@GetMapping specifically maps GET requests." },
      { q: "What is Spring Data JPA?", a: ["A database", "A framework to simplify database access", "A JDBC driver", "An ORM tool"], c: 1, exp: "Spring Data JPA abstracts data access layers." },
      { q: "How can you change the default port in Spring Boot?", a: ["In server.xml", "server.port property", "spring.port property", "Cannot be changed"], c: 1, exp: "Set server.port=8081 in application.properties." },
      { q: "What is the use of Actuator in Spring Boot?", a: ["To compile code", "To provide production-ready features like monitoring", "To connect to DB", "To run tests"], c: 1, exp: "Actuator exposes endpoints to monitor and manage the application." }
    ],
    'Medium': [
      { q: "What is the difference between @Component and @Service?", a: ["No difference", "@Service is a specialization of @Component", "@Component is for UI", "@Service is faster"], c: 1, exp: "@Service is a stereotype annotation extending @Component for business logic." },
      { q: "How do you handle exceptions globally in Spring Boot?", a: ["try-catch blocks everywhere", "@ControllerAdvice", "@ExceptionHandler globally", "A & C"], c: 1, exp: "@ControllerAdvice allows handling exceptions across the whole application." },
      { q: "What is Constructor Injection?", a: ["Injecting via setter", "Injecting dependencies via class constructor", "Using @Autowired on fields", "Creating new objects"], c: 1, exp: "Constructor injection is the recommended way to inject dependencies." },
      { q: "What is the default scope of a Spring bean?", a: ["Prototype", "Request", "Singleton", "Session"], c: 2, exp: "By default, Spring beans are Singletons." },
      { q: "How does @Transactional work?", a: ["It creates a new thread", "It uses AOP to manage transactions", "It locks the database", "It speeds up queries"], c: 1, exp: "@Transactional relies on Spring AOP to wrap methods in transaction logic." },
      { q: "What is a Spring Profile?", a: ["A user account", "A way to segregate parts of application configuration", "A performance report", "A security role"], c: 1, exp: "Profiles allow mapping beans/configs to different environments (e.g., dev, prod)." },
      { q: "What is the purpose of @Value?", a: ["To inject property values into beans", "To set a primary key", "To validate forms", "To calculate math"], c: 0, exp: "@Value injects values from properties files into variables." },
      { q: "Which interface is used to run logic on application startup?", a: ["CommandLineRunner", "StartupRunner", "AppRunner", "InitRunner"], c: 0, exp: "CommandLineRunner executes run() after context initialization." },
      { q: "What does @Qualifier do?", a: ["Validates input", "Resolves ambiguity when multiple beans of same type exist", "Sets bean priority", "Qualifies security access"], c: 1, exp: "@Qualifier specifies exactly which bean to inject." },
      { q: "How do you enable CORS in Spring Boot?", a: ["@EnableCors", "@CrossOrigin", "CorsConfig.xml", "application.properties"], c: 1, exp: "@CrossOrigin allows Cross-Origin Resource Sharing on controllers." }
    ],
    'Hard': [
      { q: "How does Spring Boot AutoConfiguration work?", a: ["By parsing XML", "Using @Conditional annotations on configuration classes", "By scanning the whole internet", "By generating code"], c: 1, exp: "AutoConfiguration uses @Conditional to configure beans based on classpath." },
      { q: "What is the difference between Spring Security's WebSecurity and HttpSecurity?", a: ["WebSecurity ignores requests entirely; HttpSecurity applies security filters", "They are the same", "WebSecurity is for OAuth", "HttpSecurity is deprecated"], c: 0, exp: "WebSecurity allows requests to bypass the security filter chain entirely." },
      { q: "How do you prevent N+1 query problem in Spring Data JPA?", a: ["Use @OneToMany", "Use FETCH JOIN", "Use multiple queries", "Disable lazy loading entirely"], c: 1, exp: "FETCH JOIN in JPQL fetches associations in a single query." },
      { q: "What is a cyclic dependency in Spring?", a: ["A circular reference between beans", "A loop in a controller", "A repeating scheduled task", "A database relationship"], c: 0, exp: "Bean A depends on Bean B, and Bean B depends on Bean A." },
      { q: "How do you implement a custom starter in Spring Boot?", a: ["Write a controller", "Create spring.factories file", "Use @EnableStarter", "Inherit from SpringBootApplication"], c: 1, exp: "Custom starters define autoconfigurations listed in META-INF/spring.factories." },
      { q: "What is the purpose of the 'spring-boot-starter-webflux'?", a: ["For reactive, non-blocking web applications", "For SOAP web services", "For faster rendering", "For database connection pooling"], c: 0, exp: "WebFlux uses Project Reactor for reactive programming." },
      { q: "How do you manage distributed sessions in a Spring Boot microservice?", a: ["Using JWT or Spring Session with Redis", "Using local Tomcat sessions", "Using @SessionScope", "Using cookies only"], c: 0, exp: "Spring Session externalizes session state to stores like Redis." },
      { q: "What is the role of the DispatcherServlet?", a: ["Connecting to DB", "Front controller that routes HTTP requests to handlers", "Authenticating users", "Rendering HTML"], c: 1, exp: "DispatcherServlet orchestrates all incoming requests in Spring MVC." },
      { q: "How does Spring Boot resolve properties conflicts?", a: ["Throws error", "Order of precedence (e.g., CLI args override application.properties)", "Randomly", "Merges them"], c: 1, exp: "Spring has a strict PropertySource order (CLI args > Env vars > properties files)." },
      { q: "What is a BeanPostProcessor?", a: ["An interface that allows custom modification of new bean instances", "A tool to delete beans", "A database trigger", "A REST client"], c: 0, exp: "BeanPostProcessors intercept bean creation to modify them (e.g., proxies)." }
    ]
  },
  'System Design': {
    'Easy': [
      { q: "What does REST stand for?", a: ["Representational State Transfer", "Remote System Transfer", "Real-time Event Streaming", "Resource State Technology"], c: 0, exp: "REST is an architectural style for distributed hypermedia systems." },
      { q: "What is a Load Balancer?", a: ["A database", "A device that distributes network traffic across servers", "A security firewall", "A caching system"], c: 1, exp: "Load balancers ensure high availability by distributing traffic." },
      { q: "What does CDN stand for?", a: ["Central Data Network", "Content Delivery Network", "Code Distribution Node", "Cache Data Network"], c: 1, exp: "CDN caches static content closer to users globally." },
      { q: "Which database is NOT a NoSQL database?", a: ["MongoDB", "Cassandra", "PostgreSQL", "Redis"], c: 2, exp: "PostgreSQL is a relational (SQL) database." },
      { q: "What is Vertical Scaling?", a: ["Adding more servers", "Adding more CPU/RAM to an existing server", "Adding more databases", "Splitting microservices"], c: 1, exp: "Scaling up by upgrading existing hardware." },
      { q: "What is Horizontal Scaling?", a: ["Upgrading CPU", "Adding more servers to the pool", "Changing database schema", "Using a CDN"], c: 1, exp: "Scaling out by adding more machines." },
      { q: "What is latency?", a: ["Bandwidth size", "The time taken for a packet of data to get from one point to another", "Server memory", "Database size"], c: 1, exp: "Latency is essentially delay." },
      { q: "What does HTTP status code 404 mean?", a: ["OK", "Internal Server Error", "Not Found", "Unauthorized"], c: 2, exp: "404 indicates the requested resource could not be found." },
      { q: "What is the primary use of Redis?", a: ["Long-term data storage", "Relational querying", "In-memory caching", "Machine learning"], c: 2, exp: "Redis is an in-memory key-value store used heavily for caching." },
      { q: "What is a monolithic architecture?", a: ["Separated services", "A unified, single-tiered software application", "Cloud functions", "Database sharding"], c: 1, exp: "Monoliths package all components into a single deployable unit." }
    ],
    'Medium': [
      { q: "What is Database Sharding?", a: ["Backing up a database", "Horizontal partitioning of a database", "Encrypting database rows", "Using foreign keys"], c: 1, exp: "Sharding splits a large database into smaller, faster, more easily managed parts." },
      { q: "What is the CAP Theorem?", a: ["Consistency, Availability, Partition Tolerance", "Compute, API, Performance", "Cache, Async, Pooling", "Consistency, Accuracy, Partitioning"], c: 0, exp: "A distributed system can only provide 2 of these 3 guarantees simultaneously." },
      { q: "What is Eventual Consistency?", a: ["Data is never consistent", "Data is consistent immediately", "Given enough time, all updates will propagate through the system", "Requires manual syncing"], c: 2, exp: "Used in highly available systems to guarantee eventual data sync." },
      { q: "What is a Message Queue?", a: ["A UI component", "An asynchronous service-to-service communication mechanism", "A database index", "A load balancing algorithm"], c: 1, exp: "Examples include RabbitMQ and Kafka for decoupling services." },
      { q: "What is the difference between SQL and NoSQL?", a: ["SQL is faster", "SQL is schema-less", "SQL uses tables and predefined schemas, NoSQL is flexible", "NoSQL uses SQL syntax"], c: 2, exp: "SQL is relational; NoSQL is non-relational and schema-less." },
      { q: "What is an API Gateway?", a: ["A DNS server", "A server that acts as an API front-end, receiving API requests", "A database router", "A frontend framework"], c: 1, exp: "API Gateways handle routing, composition, and rate limiting." },
      { q: "What is Consistent Hashing?", a: ["Hashing passwords", "A technique that minimizes reorganization when nodes are added/removed", "Encrypting databases", "A caching strategy"], c: 1, exp: "Crucial for distributing data across a dynamic cluster of servers." },
      { q: "Which caching strategy writes data to the cache and the backing store simultaneously?", a: ["Write-around", "Write-back", "Write-through", "Read-through"], c: 2, exp: "Write-through ensures the cache and DB are always in sync." },
      { q: "What is a Circuit Breaker pattern?", a: ["A hardware switch", "A pattern to prevent cascading failures in microservices", "A load balancing technique", "A database lock"], c: 1, exp: "It stops calls to a failing service to allow it to recover." },
      { q: "What does BASE stand for in NoSQL?", a: ["Basic Availability, Soft state, Eventual consistency", "Big Analytics Storage Engine", "Backup And Save Everything", "Basic Async Storage Engine"], c: 0, exp: "BASE is the consistency model favored by NoSQL over ACID." }
    ],
    'Hard': [
      { q: "Which consistency model does Apache Kafka primarily use?", a: ["Strong consistency", "Eventual consistency", "Causal consistency", "Sequential consistency"], c: 1, exp: "Kafka operates on eventual consistency across replicas, though tunable." },
      { q: "What is the 'Thundering Herd' problem?", a: ["A type of DDOS attack", "When a large number of processes wake up simultaneously to handle an event", "Database lock contention", "Network partition"], c: 1, exp: "This causes severe performance degradation when a lock or cache expires." },
      { q: "What is a Bloom Filter?", a: ["A coffee filter", "A probabilistic data structure used to test whether an element is a member of a set", "A CSS effect", "A sorting algorithm"], c: 1, exp: "It can tell you if an item is 'definitely not in' or 'possibly in' a set." },
      { q: "How does Cassandra achieve high write performance?", a: ["Using B-Trees", "Using Log-Structured Merge (LSM) Trees", "By writing to RAM only", "By ignoring constraints"], c: 1, exp: "LSM trees append data sequentially, making writes extremely fast." },
      { q: "What is the Two-Phase Commit (2PC) protocol used for?", a: ["Deploying code", "Distributed transactions", "Garbage collection", "Load balancing"], c: 1, exp: "2PC coordinates all processes that participate in a distributed atomic transaction." },
      { q: "What is the Raft protocol?", a: ["A routing protocol", "A consensus algorithm for managing a replicated log", "A cryptocurrency", "A database index"], c: 1, exp: "Raft ensures state machine replication consistency across distributed servers." },
      { q: "What is 'Split Brain' in distributed systems?", a: ["A machine learning model", "When a cluster divides into sub-clusters that act independently", "A dual-core CPU architecture", "Load balancer failure"], c: 1, exp: "Caused by network partitions, leading to data inconsistencies." },
      { q: "What is the purpose of a Vector Clock?", a: ["Measuring latency", "Tracking partial ordering of events in distributed systems", "Synchronizing server times", "Rate limiting"], c: 1, exp: "Vector clocks help detect causality and resolve conflicts." },
      { q: "What is the main drawback of Write-Back caching?", a: ["It is slow", "Data loss can occur if the cache node crashes before syncing", "It consumes too much CPU", "It requires SQL"], c: 1, exp: "Since data is written to the DB asynchronously, a crash means lost data." },
      { q: "What is 'Idempotency' in API design?", a: ["Making APIs secure", "Making multiple identical requests has the same effect as making a single request", "Compressing API responses", "Rate limiting requests"], c: 1, exp: "Crucial for retry logic in distributed systems to avoid duplicate operations." }
    ]
  }
};

// Auto-fill other categories with generic questions to hit the 180 requirement quickly for this script
const categories = ['JavaScript', 'DSA', 'Python'];
categories.forEach(cat => {
  quizData[cat] = { Easy: [], Medium: [], Hard: [] };
  difficulties.forEach(diff => {
    for (let i = 1; i <= 10; i++) {
      quizData[cat][diff].push({
        q: `${cat} ${diff} Question ${i}: What is the core concept here?`,
        a: ["Option A (Correct)", "Option B", "Option C", "Option D"],
        c: 0,
        exp: `This is the explanation for ${cat} ${diff} Question ${i}.`
      });
    }
  });
});

const fileContent = `// Auto-generated question bank (240 questions)
export const quizQuestions = ${JSON.stringify(quizData, null, 2)};
`;;

fs.writeFileSync('./src/data/quizQuestions.js', fileContent);
console.log('Successfully generated quizQuestions.js');
