const $pagination = document.querySelector('.pagination');
const $contactList = document.querySelector('.contact-list');
const $totalContacts = document.querySelector('#total-contacts');
let $activeButton = null;

let contacts_per_page = 10;
let pages = 0;
let currentPage = 1;

fetch('https://randomuser.me/api/?results=53')
  .then(response => response.json())
  .then(data => {
    let users = data.results;
    pages = Math.ceil(users.length / contacts_per_page);

    updateUserCount();
    displayPagination(currentPage, pages);
    displayContactsInPage(currentPage, contacts_per_page, users);
  })
  .catch(error => {
    console.log('Error fetching user data:', error);
  });

function updateUserCount() {
  $totalContacts.replaceChildren([]);
  $totalContacts.appendChild(document.createTextNode('Total: '));
  $totalContacts.appendChild(document.createTextNode(users.length));
}

function displayPagination(activePage, pages) {
  $pagination.replaceChildren([]);
  for (let i = 1; i <= pages; i++) {
    const $li = document.createElement('li');
    const $button = document.createElement('a');

    $li.appendChild($button);
    $button.value = i;
    $button.appendChild(document.createTextNode(i));

    if (i === activePage) {
      $button.classList.add('active');
      $activeButton = $button;
    }

    $button.addEventListener('click', () => {
      $activeButton.classList.remove('active');
      $button.classList.add('active');
      $activeButton = $button;
      currentPage = i;
      displayContactsInPage(i, contacts_per_page, users);
    });

    $pagination.appendChild($li);
  }
}

function displayContactsInPage(page, contactsPerPage, users) {
  $contactList.replaceChildren([]);
  let usersInPage = users.slice(
    (page - 1) * contactsPerPage,
    page * contactsPerPage
  );
  for (const user of usersInPage) {
    $contactList.appendChild(contactItem(user));
  }
}

function contactItem(user) {
  const $contactItem = document.createElement('li');
  const $contactDetails = document.createElement('div');
  const $avatar = document.createElement('img');
  const $name = document.createElement('h3');
  const $email = document.createElement('span');
  const $joinedDetails = document.createElement('div');
  const $date = document.createElement('span');

  $contactItem.appendChild($contactDetails);
  $contactItem.appendChild($joinedDetails);
  $contactDetails.appendChild($avatar);
  $contactDetails.appendChild($name);
  $contactDetails.appendChild($email);
  $joinedDetails.appendChild($date);

  $contactItem.classList.add('contact-item', 'cf');
  $contactDetails.classList.add('contact-details');
  $joinedDetails.classList.add('joined-details');
  $avatar.classList.add('avatar');
  $email.classList.add('email');

  $avatar.src = user.picture.thumbnail;
  $name.appendChild(document.createTextNode(user.name.first + ' ' + user.name.last));
  $email.appendChild(document.createTextNode(user.email || '---'));
  $date.appendChild(document.createTextNode('Joined '));
  $date.appendChild(document.createTextNode(formatDate(user.registered.date)));

  return $contactItem;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
