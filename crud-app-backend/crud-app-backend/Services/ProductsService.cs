using crud_app_backend.Data;
using crud_app_backend.Dtos;
using crud_app_backend.Models;
using crud_app_backend.Mappings;
using crud_app_backend.Services.interfaces;
using Microsoft.EntityFrameworkCore;

namespace crud_app_backend.Services;

public class ProductsService(AppDbContext db) : IProductsService
{
    public async Task<PagedResponseDto<ProductResponseDto>> GetProductsAsync(ProductQueryDto queryDto)
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
        
        return new PagedResponseDto<ProductResponseDto>(
            products.Select(product => product.ToProductResponseDto()),
            totalCount,
            queryDto.PageNumber,
            queryDto.PageSize);
    }

    public async Task<ProductResponseDto> GetProductByIdAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product == null)
        {
            throw new KeyNotFoundException($"Product with ID {id} not found.");
        }
        return product.ToProductResponseDto();
    }

    public async Task<ProductResponseDto> CreateProductAsync(CreateProductRequestDto productRequestDto)
    {
        var product = new Product
        {
            Name = productRequestDto.Name.Trim(),
            Description = productRequestDto.Description.Trim(),
            Price = productRequestDto.Price,
            Quantity = productRequestDto.Quantity,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.Products.Add(product);
        await db.SaveChangesAsync();

        return product.ToProductResponseDto();
    }

    public async Task<ProductResponseDto> UpdateProductAsync(int id, UpdateProductRequestDto productUpdateDto)
    {
        var product = await db.Products.FindAsync(id)
            ?? throw new KeyNotFoundException($"Product with ID {id} not found.");

        product.Name = productUpdateDto.Name.Trim();
        product.Description = productUpdateDto.Description.Trim();
        product.Price = productUpdateDto.Price;
        product.Quantity = productUpdateDto.Quantity;
        product.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return product.ToProductResponseDto();
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
