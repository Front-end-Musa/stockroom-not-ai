using crud_app_backend.Models;

namespace crud_app_backend.Data;

public static class DatabaselineInitializer
{
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await SeedDatabaseAsync(context);
    }

    private static async Task SeedDatabaseAsync(AppDbContext context)
    {
        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                new Product { Name = "Product 1", Price = 10.99m, Description = "Description for Product 1" },
                new Product { Name = "Product 2", Price = 19.99m, Description = "Description for Product 2" },
                new Product { Name = "Product 3", Price = 5.99m, Description = "Description for Product 3" }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}