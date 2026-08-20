using Microsoft.AspNetCore.Mvc;
using crud_app_backend.Dtos;
using crud_app_backend.Services.interfaces;

namespace crud_app_backend.Controllers;
[ApiController]
[Route("api/products")]
public class ProductsController(IProductsService productsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<ProductResponseDto>>> GetAllProducts(
        [FromQuery] ProductQueryDto queryDto)
    {
        return Ok(await productsService.GetProductsAsync(queryDto));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProductById(int id)
    {
            var product = await productsService.GetProductByIdAsync(id);
            return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponseDto>> CreateProduct(
        [FromBody] CreateProductRequestDto productRequestDto)
    {
        var createdProduct = await productsService.CreateProductAsync(productRequestDto);
        return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductResponseDto>> UpdateProduct(
        int id,
        [FromBody] UpdateProductRequestDto productUpdateDto)
    {
            var updatedProduct = await productsService.UpdateProductAsync(id, productUpdateDto);
            return Ok(updatedProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var isDeleted = await productsService.DeleteProductAsync(id);
        if (isDeleted)
        {
            return NoContent();
        }
        else
        {
            return NotFound();
        }
    }
}
