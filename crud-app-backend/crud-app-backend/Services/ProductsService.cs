using crud_app_backend.Data;
using crud_app_backend.Dtos;
using crud_app_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace crud_app_backend.Services;

public interface IProductsService
{
    Task<Product> CreateProductAsync(Product product);
    Task<Product> GetProductByIdAsync(int id);
    Task<PagedResponseDto<Product>> GetProductsAsync(ProductQueryDto queryDto);
    Task<Product> UpdateProductAsync(int id, Product product);
    Task<bool> DeleteProductAsync(int id);
}

public class ProductsService(AppDbContext db) : IProductsService
{
    public async Task<PagedResponseDto<Product>> GetProductsAsync(ProductQueryDto queryDto)
    {
        var productsQuery = db.Products.AsNoTracking().AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(queryDto.Search))
        {
            var searchTerm = queryDto.Search.Trim().ToLower();
            productsQuery = productsQuery.Where(product =>
                product.Name.ToLower().Contains(searchTerm) ||
                product.Description.ToLower().Contains(searchTerm));
        }

        var totalCount = await productsQuery.CountAsync();
        productsQuery = ApplySorting(productsQuery, queryDto.SortBy, queryDto.SortDirection);

        var products = await productsQuery
            .Skip((queryDto.PageNumber - 1) * queryDto.PageSize)
            .Take(queryDto.PageSize)
            .ToListAsync();
        
        return new PagedResponseDto<Product>(
            products,
            totalCount,
            queryDto.PageNumber,
            queryDto.PageSize);
    }

    public async Task<Product> GetProductByIdAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {id} not found.");
        }
        return product;
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        product.Name = product.Name.Trim();
        product.Description = product.Description.Trim();
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        db.Products.Add(product);
        await db.SaveChangesAsync();

        return product;
    }

    public async Task<Product> UpdateProductAsync(int id, Product updatedProduct)
    {
        var product = await db.Products.FindAsync(id)
            ?? throw new KeyNotFoundException($"Product with ID {id} not found.");

        product.Name = updatedProduct.Name.Trim();
        product.Description = updatedProduct.Description.Trim();
        product.Price = updatedProduct.Price;
        product.Quantity = updatedProduct.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null)
        {
            return false;
        }

        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return true;
    }

    private static IQueryable<Product> ApplySorting(
        IQueryable<Product> products, string? sortBy, string? sortDirection)
    {
        var isAscending = !string.Equals(sortDirection, "desc", StringComparison.OrdinalIgnoreCase);

        return sortBy?.ToLowerInvariant() switch
        {
            "name" => isAscending ? products.OrderBy(p => p.Name) : products.OrderByDescending(p => p.Name),
            "price" => isAscending ? products.OrderBy(p => p.Price) : products.OrderByDescending(p => p.Price),
            _ => isAscending ? products.OrderBy(p => p.Id) : products.OrderByDescending(p => p.Id)
        };
    }
}
