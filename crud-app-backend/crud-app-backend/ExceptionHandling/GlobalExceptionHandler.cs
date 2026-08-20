using Microsoft.AspNetCore.Diagnostics;

namespace crud_app_backend.ExceptionHandling;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not KeyNotFoundException)
        {
            return false;
        }

        await Results.Problem(
            statusCode: StatusCodes.Status404NotFound,
            title: "Resource not found")
            .ExecuteAsync(httpContext);

        return true;
    }
}