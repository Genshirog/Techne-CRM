using CRM.Core.Entities;

namespace CRM.Infrastructure.Seeders;

public static class UserSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any(u => u.Email == "superadmin@technefixer.com")) return;

        // ──────────────────────────────────────────────────────────────────────
        // 1. USERS
        // ──────────────────────────────────────────────────────────────────────

        var superAdmin = new User
        {
            Name         = "Super Admin",
            Email        = "superadmin@technefixer.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("SuperAdmin@123"),
            Address      = "Davao City, Philippines",
            PhoneNumber  = "+63 900 000 0001",
            DateOfBirth  = new DateTime(1985, 1, 1),
            Role         = UserRole.SuperAdmin,
            AccessLevel  = 99,
        };

        var admin = new User
        {
            Name         = "Admin User",
            Email        = "admin@technefixer.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Address      = "Davao City, Philippines",
            PhoneNumber  = "+63 900 000 0002",
            DateOfBirth  = new DateTime(1990, 3, 15),
            Role         = UserRole.Admin,
            AccessLevel  = 50,
        };

        var technician1 = new User
        {
            Name         = "James Alcantara",
            Email        = "james@technefixer.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Technician@123"),
            Address      = "Davao City, Philippines",
            PhoneNumber  = "+63 900 000 0003",
            DateOfBirth  = new DateTime(1992, 6, 20),
            Role         = UserRole.Technician,
            AccessLevel  = 10,
        };

        var technician2 = new User
        {
            Name         = "Paulo Mendez",
            Email        = "paulo@technefixer.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Technician@123"),
            Address      = "Davao City, Philippines",
            PhoneNumber  = "+63 900 000 0004",
            DateOfBirth  = new DateTime(1994, 9, 10),
            Role         = UserRole.Technician,
            AccessLevel  = 10,
        };

        var technician3 = new User
        {
            Name         = "Rica Santos",
            Email        = "rica@technefixer.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Technician@123"),
            Address      = "Davao City, Philippines",
            PhoneNumber  = "+63 900 000 0005",
            DateOfBirth  = new DateTime(1996, 2, 28),
            Role         = UserRole.Technician,
            AccessLevel  = 10,
        };

        var customer1 = new User
        {
            Name         = "Aisha Okonkwo",
            Email        = "aisha@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
            Address      = "Matina, Davao City",
            PhoneNumber  = "+63 917 234 5678",
            DateOfBirth  = new DateTime(1995, 4, 12),
            Role         = UserRole.Customer,
            AccessLevel  = 0,
        };

        var customer2 = new User
        {
            Name         = "Marco Reyes",
            Email        = "marco@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
            Address      = "Buhangin, Davao City",
            PhoneNumber  = "+63 918 111 2222",
            DateOfBirth  = new DateTime(1993, 7, 25),
            Role         = UserRole.Customer,
            AccessLevel  = 0,
        };

        var customer3 = new User
        {
            Name         = "Grace Tan",
            Email        = "grace@email.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer@123"),
            Address      = "Toril, Davao City",
            PhoneNumber  = "+63 919 333 4444",
            DateOfBirth  = new DateTime(1998, 11, 3),
            Role         = UserRole.Customer,
            AccessLevel  = 0,
        };

        context.Users.AddRange(
            superAdmin, admin,
            technician1, technician2, technician3,
            customer1, customer2, customer3
        );
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 2. SUPERADMIN PROFILE
        // ──────────────────────────────────────────────────────────────────────

        context.SuperAdmins.Add(new SuperAdmin
        {
            UserId     = superAdmin.Id,
            Department = "Management",
        });
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 3. TECHNICIAN PROFILES
        // ──────────────────────────────────────────────────────────────────────

        context.Technicians.AddRange(
            new Technician
            {
                UserId         = technician1.Id,
                Specialization = "Computer & Laptop Repair",
                IsAvailable    = true,
            },
            new Technician
            {
                UserId         = technician2.Id,
                Specialization = "Networking & Connectivity",
                IsAvailable    = true,
            },
            new Technician
            {
                UserId         = technician3.Id,
                Specialization = "Electrical & Wiring",
                IsAvailable    = true,
            }
        );
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 4. CUSTOMER PROFILES
        // ──────────────────────────────────────────────────────────────────────

        var cust1 = new Customer { UserId = customer1.Id, IsPrimary = true };
        var cust2 = new Customer { UserId = customer2.Id, IsPrimary = true };
        var cust3 = new Customer { UserId = customer3.Id, IsPrimary = true };

        context.Customers.AddRange(cust1, cust2, cust3);
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 5. CUSTOMER ADDRESSES
        // ──────────────────────────────────────────────────────────────────────

        context.CustomerAddresses.AddRange(
            new CustomerAddress
            {
                CustomerId = cust1.Id,
                Label      = "Home",
                Address    = customer1.Address,   // "Matina, Davao City"
                IsDefault  = true,
            },
            new CustomerAddress
            {
                CustomerId = cust2.Id,
                Label      = "Home",
                Address    = customer2.Address,   // "Buhangin, Davao City"
                IsDefault  = true,
            },
            new CustomerAddress
            {
                CustomerId = cust3.Id,
                Label      = "Home",
                Address    = customer3.Address,   // "Toril, Davao City"
                IsDefault  = true,
            }
        );
        context.SaveChanges();

        // ──────────────────────────────────────────────────────────────────────
        // 6. CUSTOMER CONTACTS
        // ──────────────────────────────────────────────────────────────────────

        context.CustomerContacts.AddRange(
            // Aisha
            new CustomerContact
            {
                CustomerId = cust1.Id,
                Type       = "Phone",
                Value      = customer1.PhoneNumber,
            },
            new CustomerContact
            {
                CustomerId = cust1.Id,
                Type       = "Email",
                Value      = customer1.Email,
            },
            // Marco
            new CustomerContact
            {
                CustomerId = cust2.Id,
                Type       = "Phone",
                Value      = customer2.PhoneNumber,
            },
            new CustomerContact
            {
                CustomerId = cust2.Id,
                Type       = "Email",
                Value      = customer2.Email,
            },
            // Grace
            new CustomerContact
            {
                CustomerId = cust3.Id,
                Type       = "Phone",
                Value      = customer3.PhoneNumber,
            },
            new CustomerContact
            {
                CustomerId = cust3.Id,
                Type       = "Email",
                Value      = customer3.Email,
            }
        );
        context.SaveChanges();
    }
}