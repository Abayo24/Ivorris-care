import { requireAdminPage } from '@/lib/admin/auth';
import { isStorageConfigured } from '@/lib/blog/store';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	await requireAdminPage();

	return (
		<>
			{!isStorageConfigured && (
				<div role='alert' className='bg-sun px-4 py-3 text-center text-sm text-ink'>
					Article storage isn&apos;t connected, so nothing can be saved yet. In Vercel, open the project → Storage →
					create a <strong>Blob</strong> store (public) and connect it, then redeploy.
				</div>
			)}
			{children}
		</>
	);
}
