import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  completed: boolean;
}

interface ActivityRemindersProps {
  activities: Activity[];
}

export function ActivityReminders({ activities }: ActivityRemindersProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      const enabled = localStorage.getItem('notificationsEnabled') === 'true';
      setNotificationsEnabled(enabled && Notification.permission === 'granted');
    }
  }, []);

  useEffect(() => {
    if (notificationsEnabled && activities.length > 0) {
      const pendingActivities = activities.filter(a => !a.completed);

      if (pendingActivities.length > 0) {
        const reminderInterval = setInterval(() => {
          const now = new Date();
          const hours = now.getHours();

          if (hours >= 9 && hours < 21 && pendingActivities.length > 0) {
            showNotification(pendingActivities.length);
          }
        }, 3600000);

        return () => clearInterval(reminderInterval);
      }
    }
  }, [notificationsEnabled, activities]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        showNotification(activities.filter(a => !a.completed).length);
      }
    }
  };

  const showNotification = (count: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Lyfora Wellness Reminder', {
        body: `You have ${count} pending ${count === 1 ? 'activity' : 'activities'} today. Keep up your wellness journey!`,
        icon: '/vite.svg',
        badge: '/vite.svg',
      });
    }
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    } else if (permission === 'granted') {
      setNotificationsEnabled(true);
      localStorage.setItem('notificationsEnabled', 'true');
    } else {
      requestNotificationPermission();
    }
  };

  const pendingCount = activities.filter(a => !a.completed).length;

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {notificationsEnabled ? (
            <Bell className="w-5 h-5 text-teal-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">Activity Reminders</h3>
            <p className="text-sm text-gray-600">
              {notificationsEnabled
                ? `${pendingCount} pending ${pendingCount === 1 ? 'activity' : 'activities'}`
                : 'Enable notifications for reminders'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleNotifications}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            notificationsEnabled
              ? 'bg-teal-500 text-white hover:bg-teal-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {notificationsEnabled ? 'Enabled' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
