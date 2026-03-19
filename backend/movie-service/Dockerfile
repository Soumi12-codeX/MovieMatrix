FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## What this does differently
```
Before (broken):
  Render looks for target/*.jar  ← not on GitHub, fails ❌

After (fixed):
  Stage 1: Render downloads Maven + Java, builds the JAR itself ✅
  Stage 2: Copies the built JAR into a clean small image ✅