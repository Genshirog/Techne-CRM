using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerCatalog;
using CRM.Infrastructure.Repositories;

namespace CRM.Infrastructure;

public class TagRepository: Repository<Tag>, ITagRepository
{
    public TagRepository(AppDbContext context) : base(context){}
}
