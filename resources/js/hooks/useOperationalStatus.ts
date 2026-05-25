import { usePage } from '@inertiajs/react';

interface UnitSchedule {
    open: string;
    close: string;
    is_open: boolean;
}

interface UnitSettings {
    is_active: boolean;
    schedule: Record<string, UnitSchedule>;
}

export function useOperationalStatus(unitName: string) {
    const { settings } = usePage().props as any;
    
    // Default return if no settings found (fallback to always open to avoid breaking)
    if (!settings || !settings[unitName]) {
        return { isOpen: true, message: '', openTimeStr: '08:00', closeTimeStr: '17:00' };
    }

    const unitSettings = settings[unitName] as UnitSettings;

    if (!unitSettings.is_active) {
        return { isOpen: false, message: 'Layanan ini sedang tidak aktif.', openTimeStr: '08:00', closeTimeStr: '17:00' };
    }

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const dayName = days[today.getDay()];
    
    const todaySchedule = unitSettings.schedule[dayName];
    const openTimeStr = todaySchedule?.open ?? '08:00';
    const closeTimeStr = todaySchedule?.close ?? '17:00';

    if (!todaySchedule || !todaySchedule.is_open) {
        return { isOpen: false, message: 'Toko libur hari ini.', openTimeStr, closeTimeStr };
    }

    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTime = currentHour + currentMinute / 60;

    const [openHour, openMinute] = openTimeStr.split(':').map(Number);
    const openTime = openHour + (openMinute || 0) / 60;

    const [closeHour, closeMinute] = closeTimeStr.split(':').map(Number);
    const closeTime = closeHour + (closeMinute || 0) / 60;

    let isOpen = false;
    if (closeTime < openTime) {
        // Operational hours cross midnight (e.g. 08:00 to 01:00)
        isOpen = currentTime >= openTime || currentTime < closeTime;
    } else {
        // Normal operational hours within the same day (e.g. 08:00 to 17:00)
        isOpen = currentTime >= openTime && currentTime < closeTime;
    }

    if (!isOpen) {
        return { isOpen: false, message: `Buka pukul ${openTimeStr} - ${closeTimeStr} WIB.`, openTimeStr, closeTimeStr };
    }

    return { isOpen: true, message: '', openTimeStr, closeTimeStr };
}
