```markdown
# AGENTS.md - Guidelines for AI Coding Agents

These guidelines are designed to ensure the creation of high-quality, maintainable, and reliable AI coding agents. Adherence to these principles is crucial for maximizing productivity and minimizing potential issues.

## 1. DRY (Don't Repeat Yourself)

*   **Single Responsibility Principle:** Each agent should have a clearly defined and focused responsibility. Avoid creating agents with duplicated logic or functionality.
*   **Abstraction:** Implement abstractions where appropriate to represent common patterns and reduce code repetition.
*   **Component-Based Design:** Use components to encapsulate reusable logic and promote modularity.

## 2. KISS (Keep It Simple, Stupid)

*   **Minimal Code:** Strive for the shortest possible solution that achieves the required functionality.
*   **Readability:** Code should be easy to understand and follow, using meaningful variable and function names.
*   **Avoid Complexity:** Resist over-engineering solutions; prioritize clarity over potential optimization.

## 3. SOLID Principles

*   **Single Responsibility:**  Each class/component/agent should have one primary responsibility.
*   **Open/Closed Principle:**  The agent’s design should allow for extension without modifying the core logic. (Consider external configuration files or modules for future extensions).
*   **Liskov Substitution Principle:**  Subclasses should be substitutable for their base classes without altering the correctness of the program.
*   **Interface Segregation Principle:**  Clients should not be forced to depend on methods they do not use.
*   **Dependency Inversion Principle:** Client code should not depend on implementation details; they should depend on abstractions.

## 4. YAGNI (You Aren’t Gonna Need It)

*   **Defer Unnecessary Code:**  Do not write code that isn't currently required.  Avoid adding features or functionalities that are likely not needed in the future.
*   **Focus on the Core Task:**  Prioritize implementing the essential requirements for the agent to achieve its intended purpose.

## 5. Code Quality & Structure

*   **Comments:**  Provide concise and informative comments explaining *why* the code is doing something, not *what* it's doing.
*   **Naming Conventions:**  Follow consistent naming conventions (e.g., camelCase for variables and functions, PascalCase for classes).
*   **Code Formatting:** Use a code formatter (e.g., Black) to ensure consistent code style.
*   **Error Handling:** Implement basic error handling and logging to identify potential issues.
*   **Testing:**  All code must be thoroughly tested.  A minimum of 80% test coverage is required.

## 6.  Specific Guidelines & Constraints

*   **Maximum Code Length:** 180 lines of code.
*   **Test Coverage:** 80% minimum.  Coverage will be automatically assessed using a dedicated testing framework.
*   **File Structure:** Each file should have a distinct purpose and be logically organized.  Follow a consistent directory structure (e.g., "agents/agent_x/").
*   **Modularization:**  Each agent should ideally be modular, allowing for easy reuse of components.
*   **Configuration:** Utilize configuration files for input parameters and settings, avoiding hardcoded values.
*   **Data Handling:** Data must be handled in a consistent and well-documented manner.

## 7.  Development Practices

*   **Iterative Development:** Break down the project into smaller, manageable iterations.
*   **Version Control:** Use Git for version control and collaborative development.
*   **Code Reviews:** Conduct regular code reviews to identify potential issues and ensure code quality.

## 8.  Future Considerations (To be addressed in future iterations - not required initially)

*   **Logging:** Implement structured logging for debugging and monitoring.
*   **Configuration Management:** Introduce a robust configuration management system.
*   **API Design:** Consider designing clear and documented APIs for future agent extensions.


These guidelines are intended to provide a framework for the development of AGENTS.md.  Their implementation should be prioritized based on the specific requirements of each agent.  Any code written must adhere to these principles.
```