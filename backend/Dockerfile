
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN chmod +x mvnw

COPY src src

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar target/*.jar"]
