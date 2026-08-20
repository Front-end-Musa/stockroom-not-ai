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
        [param: Required, StringLength(100)]
        string Name,

        [param: Required, StringLength(1000)]
        string Description,

        [param: Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
        decimal Price,

        [param: Range(0, int.MaxValue)]
        int Quantity);

    public record UpdateProductRequestDto(
        [param: Required, StringLength(100)]
        string Name,

        [param: Required, StringLength(1000)]
        string Description,

        [param: Range(typeof(decimal), "0.01", "79228162514264337593543950335")]
        decimal Price,

        [param: Range(0, int.MaxValue)]
        int Quantity);

    public record ProductQueryDto(
        string? Search = null,

        [param: Range(1, int.MaxValue)]
        int PageNumber = 1,

        [param: Range(1, 100)]
        int PageSize = 10,

        string? SortBy = null,
        string? SortDirection = "asc") : IValidatableObject
    {

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var allowedSortFields = new[] { "id", "name", "price", "description" };

            if (!string.IsNullOrWhiteSpace(SortBy) &&
                !allowedSortFields.Contains(SortBy, StringComparer.OrdinalIgnoreCase))
            {
                yield return new ValidationResult(
                    $"sortBy must be one of: {string.Join(", ", allowedSortFields)}.",
                    new[] { nameof(SortBy) });
            }

            if (!string.IsNullOrWhiteSpace(SortDirection) &&
                !new[] { "asc", "desc" }.Contains(SortDirection, StringComparer.OrdinalIgnoreCase))
            {
                yield return new ValidationResult(
                    "sortDirection must be either asc or desc.",
                    new[] { nameof(SortDirection) });
            }
        }
    }
}
