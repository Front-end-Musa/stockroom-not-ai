using System.ComponentModel.DataAnnotations;

namespace crud_app_backend.Dtos
{
    public record ProductResponseDto(
        int Id,
        string Name,
        string Description,
        decimal Price,
        int Quantity,
        DateTime CreatedAt,
        DateTime UpdatedAt);

    public record CreateProductRequestDto(
        string Name,
        string Description,
        decimal Price,
        int Quantity);

    public record UpdateProductRequestDto(
        string Name,
        string Description,
        decimal Price,
        int Quantity);

    public record ProductQueryDto(
        string? Search = null,

        [param: Range(1, int.MaxValue)]
        int PageNumber = 1,

        [param: Range(1, 100)]
        int PageSize = 10,

        string? SortBy = null,
        string? SortDirection = "asc");
}
