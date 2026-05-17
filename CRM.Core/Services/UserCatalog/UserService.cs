using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CRM.Core.DTOs.Users;
using CRM.Core.Entities;
using CRM.Core.Repositories.UserCatalog;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CRM.Core.Services.UserCatalog;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public UserService(IUserRepository userRepository, IConfiguration configuration){
        _userRepository = userRepository;
        _configuration = configuration;
    }
    
    public async Task<AuthResponseDto> RegisterAsync(CreateUserDto request){
        if (await _userRepository.EmailExistsAsync(request.Email)){
            throw new Exception("Email already exists.");
        }

        var user = new User{
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Role = UserRole.Customer
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        
        return new AuthResponseDto{
            Token = GenerateToken(user),
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto request)
    {
        if (await _userRepository.EmailExistsAsync(request.Email))
            throw new Exception("Email already exists.");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Address = request.Address,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = request.DateOfBirth,
            Role = request.Role,
            AccessLevel = request.AccessLevel
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        return MapToResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid email or password.");

        return new AuthResponseDto
        {
            Id = user.Id,
            Token = GenerateToken(user),
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if(user == null) return null;
        return MapToResponse(user);
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var user = await _userRepository.GetAllAsync();
        return user.Select(MapToResponse);
    }

    public async Task<UserResponseDto> UpdateAsync(UpdateUserDto request)
    {
        var user = await _userRepository.GetByIdAsync(request.Id)
        ?? throw new Exception($"User {request.Id} not found.");
        user.Name = request.Name;
        user.Email = request.Email;
        user.Address = request.Address;
        user.PhoneNumber = request.PhoneNumber;
        user.DateOfBirth = request.DateOfBirth;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return MapToResponse(user);
    }

    public async Task UpdateRoleAsync(UpdateUserRoleDto request)
    {
        var user = await _userRepository.GetByIdAsync(request.Id)
        ?? throw new Exception($"User {request.Id} not found.");

        user.Role = request.Role;
        user.AccessLevel = request.AccessLevel;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(ChangePasswordDto request)
    {
        var user = await _userRepository.GetByIdAsync(request.Id)
        ?? throw new Exception($"User {request.Id} not found.");

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            throw new Exception("Current password is incorrect.");
        
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new Exception($"User {id} not found."); 

        _userRepository.Delete(user);
        await _userRepository.SaveChangesAsync();
    }

    private string GenerateToken(User user){
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new []{
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiresInDays"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserResponseDto MapToResponse(User entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        Email = entity.Email,
        Address = entity.Address,
        PhoneNumber = entity.PhoneNumber,
        DateOfBirth = entity.DateOfBirth,
        Role = entity.Role,
        AccessLevel = entity.AccessLevel,
        CreatedAt = entity.CreatedAt
    };
}
