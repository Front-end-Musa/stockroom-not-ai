namespace crud_app_backend.Data;

using crud_app_backend.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).HasMaxLength(100).IsRequired();
            entity.Property(p => p.Description).HasMaxLength(1000).IsRequired();
            entity.ToTable(table =>
            {
                table.HasCheckConstraint("CK_Products_Price_Positive", "\"Price\" > 0");
                table.HasCheckConstraint("CK_Products_Quantity_NonNegative", "\"Quantity\" >= 0");
            });
        });
    }
}
