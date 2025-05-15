using Microsoft.EntityFrameworkCore;


namespace Y_te_hoc_duong.Data
{
    public class SchoolMedicalContext: DbContext
    {
        public SchoolMedicalContext(DbContextOptions<SchoolMedicalContext> options) : base(options) { }
    }
}
