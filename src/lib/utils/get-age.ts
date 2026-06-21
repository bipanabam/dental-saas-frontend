export function getAge(dateOfBirth?: string | Date | null): number | null {
    if (!dateOfBirth) return null;

    const birth = new Date(dateOfBirth);

    if (Number.isNaN(birth.getTime())) {
        return null;
    }

    const today = new Date();

    let age =
        today.getFullYear() -
        birth.getFullYear();

    const beforeBirthday =
        today.getMonth() < birth.getMonth() ||
        (
            today.getMonth() === birth.getMonth() &&
            today.getDate() < birth.getDate()
        );

    if (beforeBirthday) age--;

    return age >= 0 ? age : null;
}
