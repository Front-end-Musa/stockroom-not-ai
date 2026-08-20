using crud_app_backend.Dtos;

namespace crud_app_backend.Services.interfaces;
public interface IProductsService
{
    Task<ProductResponseDto> CreateProductAsync(CreateProductRequestDto productRequestDto);
    Task<ProductResponseDto> GetProductByIdAsync(int id);
    Task<PagedResponseDto<ProductResponseDto>> GetProductsAsync(ProductQueryDto queryDto);
    Task<ProductResponseDto> UpdateProductAsync(int id, UpdateProductRequestDto productUpdateDto);
    Task<bool> DeleteProductAsync(int id);
}
