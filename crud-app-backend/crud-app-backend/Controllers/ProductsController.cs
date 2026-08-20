using Microsoft.AspNetCore.Mvc;
using crud_app_backend.Dtos;
using crud_app_backend.Models;
using AutoMapper;

namespace crud_app_backend.Controllers;
[ApiController]
[Route("api/products")]
public class ProductsController(IProductsService productsService, IMapper mapper) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<ProductResponseDto>>> GetAllProducts(
        [FromQuery] ProductQueryDto queryDto)
    {
        var products = await productsService.GetProductsAsync(queryDto);
        var response = new PagedResponseDto<ProductResponseDto>(
            mapper.Map<IEnumerable<ProductResponseDto>>(products.Items),
            products.TotalCount,
            products.PageNumber,
            products.PageSize);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProductById(int id)
    {
            var product = await productsService.GetProductByIdAsync(id);
            return Ok(mapper.Map<ProductResponseDto>(product));
    }

    [HttpPost]
    public async Task<ActionResult<ProductResponseDto>> CreateProduct(
        [FromBody] CreateProductRequestDto productRequestDto)
    {
        var product = mapper.Map<Product>(productRequestDto);
        var createdProduct = await productsService.CreateProductAsync(product);
        var response = mapper.Map<ProductResponseDto>(createdProduct);
        return CreatedAtAction(nameof(GetProductById), new { id = response.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductResponseDto>> UpdateProduct(
        int id,
        [FromBody] UpdateProductRequestDto productUpdateDto)
    {
            var product = mapper.Map<Product>(productUpdateDto);
            var updatedProduct = await productsService.UpdateProductAsync(id, product);
            return Ok(mapper.Map<ProductResponseDto>(updatedProduct));
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
