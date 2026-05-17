using CRM.Core.DTOs.CustomerCatalog;
using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;

namespace CRM.Core.Services.CustomerCatalog;

public class TagService : GeneralService<Tag, TagResponseDto,CreateTagDto, UpdateTagDto>, ITagService
{
    private readonly ITagRepository _repo;

    public TagService(ITagRepository repo) : base(repo)
    {
        _repo = repo;
    }

    public override Tag MapToEntity(CreateTagDto request) => new()
    {
        Color = request.Color,
        Name = request.Name,
    };

    public override TagResponseDto MapToResponse(Tag entity) => new()
    {
        Id = entity.Id,
        Color = entity.Color,
        Name = entity.Name,
        CreatedAt = entity.CreatedAt,
    };

    public override async Task<TagResponseDto> UpdateAsync(UpdateTagDto request)
    {
        var entity = await _repo.GetByIdAsync(request.Id) ?? throw new Exception($"Not Found");
        entity.Color = request.Color;
        entity.Name = request.Name;

        _repo.Update(entity);
        await _repo.SaveChangesAsync();
        return MapToResponse(entity);  
    }
}
