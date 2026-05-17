using CRM.Core.Entities;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface ITicketRepository : IRepository<Ticket>
{
    Task<IEnumerable<Ticket>> GetByCustomerIdAsync(int custoemrId);
    Task<IEnumerable<Ticket>> GetByStatusAsync(TicketStatus status);
    Task<IEnumerable<Ticket>> GetByPriorityAsync(TicketPriority priority);
    Task<IEnumerable<Ticket>> GetByAssignedToAsync(int technicianId);
    Task<Ticket?> GetWithRepliesAsync(int id);
}
