using crud_app_backend.Dtos;
using crud_app_backend.Models;
using AutoMapper;

namespace crud_app_backend.Mappings;

public class ProductMappingProfile : Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Product, ProductResponseDto>();
        CreateMap<CreateProductRequestDto, Product>();
        CreateMap<UpdateProductRequestDto, Product>();
    }
}
