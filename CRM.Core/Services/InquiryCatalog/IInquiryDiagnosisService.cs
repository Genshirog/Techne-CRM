using CRM.Core.DTOs.InquiryCatalog;
using CRM.Core.Entities;

namespace CRM.Core.Services.InquiryCatalog;

public interface IInquiryDiagnosisService : IChildService<InquiryDiagnosis,InquiryDiagnosisResponseDto, CreateInquiryDiagnosisDto>
{
    Task<IEnumerable<InquiryDiagnosisResponseDto>> GetByDiagnosisCatalogId(int catalogId);
}
