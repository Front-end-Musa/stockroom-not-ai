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

        [param: Range(0, int.MaxValue)]
        int Quantity);

    public record UpdateProductRequestDto(
        string Name,

        string Description,

        decimal Price,

        [param: Range(0, int.MaxValue)]
        int Quantity);
    }

    public record ProductQueryDto(
        string? Search = null,

        int PageNumber = 1,

        int PageSize = 10,

        string? SortBy = null,
        string? SortDirection = "asc");

    internal static class ProductRequestValidation
    {
        public static IEnumerable<ValidationResult> ValidateRequiredText(string name, string description)
        {
            if (string.IsNullOrEmpty(name?.Trim()))
            {
                yield return new ValidationResult(
                    "Name must contain non-whitespace characters.",
                    new[] { "Name" });
            }

            if (string.IsNullOrEmpty(description?.Trim()))
            {
                yield return new ValidationResult(
                    "Description must contain non-whitespace characters.",
                    new[] { "Description" });
            }
        }
    }
}
