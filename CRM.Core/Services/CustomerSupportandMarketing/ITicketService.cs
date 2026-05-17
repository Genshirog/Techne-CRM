using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Entities;
using CRM.Core.Services;

namespace CRM.Core.Repositories.CustomerSupportandMarketing;

public interface ITicketService : IGeneralService<TicketResponseDto,CreateTicketDto,UpdateTicketDto>
{

}
