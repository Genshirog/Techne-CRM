# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files first (for layer caching)
COPY CRM.API/CRM.API.csproj CRM.API/
COPY CRM.Core/CRM.Core.csproj CRM.Core/
COPY CRM.Infrastructure/CRM.Infrastructure.csproj CRM.Infrastructure/

RUN dotnet restore CRM.API/CRM.API.csproj

# Copy everything else and build
COPY . .
RUN dotnet publish CRM.API/CRM.API.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "CRM.API.dll"]