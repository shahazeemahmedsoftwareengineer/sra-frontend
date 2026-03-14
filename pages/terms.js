import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head><title>Terms of Service — SRA Shield</title></Head>
      <div style={{maxWidth:'780px',margin:'0 auto',padding:'120px 28px 80px'}}>
        <h1 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'42px',fontWeight:900,color:'var(--charcoal)',marginBottom:'8px',letterSpacing:'-1.5px'}}>Terms of Service</h1>
        <p style={{fontSize:'14px',color:'var(--gray)',marginBottom:'48px'}}>Last updated: March 2026</p>

        {[
          ['Acceptance of Terms','By creating an account and using SRA Shield, you agree to these Terms of Service. If you do not agree, please do not use the service.'],
          ['Use of Service','SRA Shield provides an encryption API for lawful data protection purposes only. You may not use the service for any illegal, harmful, or unauthorized activity.'],
          ['Account Responsibility','You are responsible for maintaining the security of your account credentials and encryption keys. SRA Shield cannot recover lost encryption keys under any circumstances.'],
          ['API Usage Limits','Each plan has defined API call limits per month. Exceeding your plan limit will result in 429 errors until the next billing cycle or until you upgrade your plan.'],
          ['Data & Zero-Knowledge','SRA Shield does not store your plaintext data or encryption keys. You are solely responsible for securely storing your encryption keys. Loss of keys means loss of access to encrypted data.'],
          ['Service Availability','We target 99.9% uptime on paid plans. Scheduled maintenance will be communicated in advance. SRA Shield is not liable for losses caused by service interruptions.'],
          ['Termination','You may cancel your account at any time. We reserve the right to suspend accounts that violate these terms. Upon termination, your account data will be deleted within 30 days.'],
          ['Limitation of Liability','SRA Shield is provided as-is. We are not liable for any indirect, incidental, or consequential damages arising from use of the service.'],
          ['Changes to Terms','We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.'],
          ['Contact','For questions about these terms, contact us at legal@srashield.com'],
        ].map(([title, text]) => (
          <div key={title} style={{marginBottom:'36px',paddingBottom:'36px',borderBottom:'1px solid var(--border)'}}>
            <h2 style={{fontFamily:"'Urbanist',sans-serif",fontSize:'20px',fontWeight:800,color:'var(--charcoal)',marginBottom:'10px'}}>{title}</h2>
            <p style={{fontSize:'15px',color:'var(--gray)',lineHeight:1.75}}>{text}</p>
          </div>
        ))}
      </div>
    </>
  );
}