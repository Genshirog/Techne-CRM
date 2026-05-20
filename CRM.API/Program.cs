using System.ComponentModel;
using System.Text;
using CRM.API.Converters;
using CRM.API.Extensions;
using CRM.API.Middleware;
using CRM.Core.Repositories;
using CRM.Core.Services;
using CRM.Infrastructure;
using CRM.Infrastructure.Seeders;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddRepositories();
builder.Services.AddServiceCatalog();
builder.Services.AddBillingServices();
builder.Services.AddInquiryServices();
builder.Services.AddJobOrderServices();
builder.Services.AddQuotationServices();
builder.Services.AddCustomerDeviceServices();
builder.Services.AddCustomerSupportServices();
builder.Services.AddUserServices();
builder.Services.AddCustomerServices();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>{
    options.TokenValidationParameters = new TokenValidationParameters{
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))

    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CRMPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


builder.Services.AddAuthorization();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(
                new System.Text.Json.Serialization.JsonStringEnumConverter()
            );
            options.JsonSerializerOptions.Converters.Add(new DateOnlyJsonConverter());
        });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // runs pending migrations first
    ServiceCatalogSeeder.Seed(db);
    UserSeeder.Seed(db);
    DeviceCatalogSeeder.Seed(db);
    DiagnosisCatalogSeeder.Seed(db);
    TagSeeder.Seed(db);
}


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithOpenApiRoutePattern("/openapi/v1.json");
    });
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("CRMPolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();