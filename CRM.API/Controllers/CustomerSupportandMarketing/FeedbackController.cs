using CRM.Core.DTOs.CustomerSupportandMarketing;
using CRM.Core.Services.CustomerSupportandMarketing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRM.API.Controllers.CustomerSupportandMarketing;


[ApiController]
[Route("api/feedbacks")]
public class FeedbackController(FeedbackService service) : BaseController<FeedbackResponseDto, CreateFeedbackDto, UpdateFeedbackDto>(service)
{   
    [Authorize(Roles ="Admin,SuperAdmin,Customer")]
    [HttpPost]
    public override async Task<IActionResult> Create([FromBody] CreateFeedbackDto dto)
    {
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = (result as dynamic).Id }, result);
    }

    [Authorize(Roles ="Admin,SuperAdmin,Customer")]
    [HttpPut]
    public override async Task<IActionResult> Update([FromBody] UpdateFeedbackDto dto)
        => Ok(await service.UpdateAsync(dto));

    [Authorize(Roles ="Admin,SuperAdmin,Customer")]
    [HttpDelete("{id}")]
    public override async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("job-order/{jobOrderId}")]
    public async Task<IActionResult> GetByJobOrderId(int jobOrderId) => Ok(await service.GetByJobOrderIdAsync(jobOrderId));
    
    [Authorize(Roles ="Admin,SuperAdmin")]
    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetByCustomerId(int customerId) => Ok(await service.GetByCustomerIdAsync(customerId));
    
    [HttpGet("average-rating")]
    public async Task<IActionResult> GetAverageRating() => Ok(await service.GetAverageRatingAsync());
    [HttpGet("average-rating/{id}")]
    public async Task<IActionResult> GetAverageTechnicianRating(int id) => Ok(await service.GetByJobOrderIdAsync(id));
}
