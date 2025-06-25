"""Database backup script."""
import os
import sys
import datetime
import subprocess
from pathlib import Path

def create_backup(
    db_name: str,
    backup_dir: str = "backups",
    keep_days: int = 7
) -> bool:
    """Create a database backup."""
    try:
        # Create backup directory if it doesn't exist
        backup_path = Path(backup_dir)
        backup_path.mkdir(parents=True, exist_ok=True)

        # Generate backup filename with timestamp
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = backup_path / f"{db_name}_{timestamp}.sql"

        # Run pg_dump
        result = subprocess.run([
            "pg_dump",
            "-h", os.getenv("DB_HOST", "localhost"),
            "-U", os.getenv("DB_USER", "postgres"),
            "-d", db_name,
            "-f", str(backup_file)
        ], capture_output=True, text=True)

        if result.returncode != 0:
            print(f"Backup failed: {result.stderr}")
            return False

        # Clean up old backups
        cleanup_old_backups(backup_path, keep_days)
        return True

    except Exception as e:
        print(f"Error creating backup: {str(e)}")
        return False

def cleanup_old_backups(backup_path: Path, keep_days: int):
    """Remove backups older than keep_days."""
    current_time = datetime.datetime.now()
    for backup_file in backup_path.glob("*.sql"):
        file_time = datetime.datetime.fromtimestamp(backup_file.stat().st_mtime)
        if (current_time - file_time).days > keep_days:
            backup_file.unlink()

if __name__ == "__main__":
    db_name = sys.argv[1] if len(sys.argv) > 1 else os.getenv("DB_NAME")
    if not db_name:
        print("Please provide database name as argument or set DB_NAME environment variable")
        sys.exit(1)

    success = create_backup(db_name)
    sys.exit(0 if success else 1) 