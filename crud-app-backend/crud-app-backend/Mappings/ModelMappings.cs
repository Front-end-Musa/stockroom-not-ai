using crud_app_backend.Dtos;
using crud_app_backend.Models;

namespace crud_app_backend.Mappings;
public static class ModelMappings
{
    public static ProductResponseDto ToProductResponseDto(this Product product)
    {
        return new ProductResponseDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Quantity,
            product.CreatedAt,
            product.UpdatedAt
        );
    }
}