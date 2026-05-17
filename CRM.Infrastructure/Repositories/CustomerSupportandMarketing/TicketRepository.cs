using CRM.Core.Entities;
using CRM.Core.Repositories.CustomerSupportandMarketing;
using Microsoft.EntityFrameworkCore;

namespace CRM.Infrastructure.Repositories.CustomerSupportandMarketing;

public class TicketRepository : Repository<Ticket>, ITicketRepository
{
    public TicketRepository(AppDbContext context) : base(context){}

    public async Task<IEnumerable<Ticket>> GetByAssignedToAsync(int technicianId)
    {
        return await _dbSet.Where(t => t.AssignedTo == technicianId).ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByCustomerIdAsync(int custoemrId)
    {
        return await _dbSet.Where(t => t.CustomerId == custoemrId).ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByPriorityAsync(TicketPriority priority)
    {
        return await _dbSet.Where(t => t.Priority == priority).ToListAsync();
    }

    public async Task<IEnumerable<Ticket>> GetByStatusAsync(TicketStatus status)
    {
        return await _dbSet.Where(t => t.Status == status).ToListAsync();
    }

    public async Task<Ticket?> GetWithRepliesAsync(int id)
    {
        return await _dbSet.Include(t => t.Replies).FirstOrDefaultAsync(t => t.Id == id);
    }
}
