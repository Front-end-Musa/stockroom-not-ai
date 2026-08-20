namespace crud_app_backend.Dtos
{
    public record PagedResponseDto<T>(
        IEnumerable<T> Items,
        int TotalCount,
        int PageNumber,
        int PageSize);
}