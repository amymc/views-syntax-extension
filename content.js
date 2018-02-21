;(global => {
  const checkPage = () => {
    // pr diff page
    if (/pull/.test(location.href)) {
      const headers = Array.from(document.querySelectorAll('.file-header'))

      headers.forEach(header => {
        if (/\.view$/.test(header.getAttribute('data-path'))) {
          const table = header.nextElementSibling.querySelectorAll('tbody')[0]
          checkLayout(table)
        }
      })
      // regular file page
    } else if (/\.view$/.test(location.href)) {
      const table = document.querySelectorAll(
        '.repository-content .file tbody'
      )[0]
      applyFileSyntax(table)
    }
  }

  // check if it's unified or split(default)
  const checkLayout = table => {
    if (/diff=unified$/.test(location.href)) {
      applyPRSyntax(2, table)
    } else {
      applyPRSyntax(1, table)
      applyPRSyntax(3, table)
    }
  }

  const parseRow = row => {
    // trim the row because the first character is always
    // either '+', '-' or a blank space
    //debugger
    const trimmedStr = row.innerText.match(/([a-z]|[A-Z])(.+)/)
    if (!trimmedStr) return

    // now split it because the before and after columns are one row 😬
    const rawColumns = trimmedStr[0].split(/\s\s\s/)
    const columns = rawColumns.map(column => column.replace('<', '&lt;'))
    return columns
  }

  const applyPRSyntax = (index, table) => {
    // what if there are pluses or minuses at the begining of the line?

    const rows = Array.from(table.children)
    rows.forEach(row => {
      if (
        !row.children[index] ||
        /\bempty-cell\b/.test(row.children[index].className)
      )
        return

      const columns = parseRow(row)
      if (!columns) return

      columns.forEach(column => {
        if (/^(\+)?(\-)?[A-Z]/.test(column /*row.innerText.trim()*/)) {
          // const columns = parseRow(row)

          // looking for words starting with a capital letter,
          // followed by either a blank space or line end
          // otherwise it was matching on the file name in the anchor tag 😬
          const title = column.match(/[A-Z]([a-zA-Z]+(\s|$))/)[0]

          //           =======
          //       if (/^(\+)?(\-)?[A-Z]/.test(row.innerText.trim())) {
          //         // debugger
          //         const columns = parseRow(row)
          //         const titles = columns.map(column => column.match(/[A-Z]([a-zA-Z]+)/))

          //         titles.forEach(title =>
          //           row.children[index].innerHTML = row.children[index].innerHTML
          //           .replace(
          //             title[0],
          //             `<span style="color:#ff8300;">${title[0]}</span>`
          // >>>>>>> Stashed changes

          row.children[index].innerHTML = row.children[index].innerHTML.replace(
            title,
            `<span style="color:#ff8300;">${title}</span>`
          )
          // .replace(
          //   columns[1],
          //   `<span style="color:#ff8300;">${columns[1]}</span>`
          // )

          // let lines = row.children[index].innerHTML.split(
          //   '<span class="blob-code-inner">'
          // )
          // // debugger
          // if (lines[1]) {
          //   let lineSubstrings = lines[1].trim().split(' ')

          //   lineSubstrings[0] = `<span style="color:#ff8300;">${
          //     lineSubstrings[0]
          //   }</span>`
          //   lines[1] = lineSubstrings.join(' ')
          //   row.children[index].innerHTML = lines.join(
          //     '<span class="blob-code-inner">'
          //   )
          //   //}
        } else if (/^(\+)?(\-)?#.+$/.test(column)) {
          //debugger
          //(?:)

          row.innerHTML = row.innerHTML.replace(
            column.match(/#.+$/),
            `<span style="color:#7DB1B9B3;">${column.match(/#.+$/)}</span>`
          )

          debugger

          // row.children[index].innerHTML = row.children[index].innerHTML
          //   .replace(
          //     titles[0][0],
          //     `<span style="color:#ff8300;">${titles[0][0]}</span>`
          //   )
          //   .replace(
          //     titles[1][0],
          //     `<span style="color:#ff8300;">${titles[1][0]}</span>`
          //   )

          //  comments
          //   //row.children[index].children[1].style.color = '#7DB1B9B3'
        } else if (column.includes('onWhen')) {
          // TODO: move this
          //debugger
          // const columns = parseRow(row)
          // trimmedStr[0] = `<span style="color:#A2E1F90;">${trimmedStr[0]}</span>`
          row.children[index].innerHTML = row.children[index].innerHTML.replace(
            column,
            `<span style="color:#A2E1F9;">${column}</span>`
          )
          //row.children[index].children[1].style.color = '#A2E1F9'
        } else if (column.includes('&lt;')) {
          // slots
          //#00AEEF;
          debugger

          row.innerHTML = row.innerHTML.replace(
            column.match(/&lt;([a-z][a-zA-Z0-9]*)?/)[0],
            `<span style="color:#00AEEF;">${
              column.match(/&lt;([a-z][a-zA-Z0-9]*)?/)[0]
            }</span>`
          )
        } else if (/^(\+)?(\-)?[a-z]/.test(column)) {
          // strings
          debugger
          let lines = row.children[index].innerHTML.split(
            '<span class="blob-code-inner">'
          )

          if (lines[1]) {
            let lineSubstrings = lines[1].split(/\s([a-z][a-zA-Z0-9]*)/)

            for (i = 2; i < lineSubstrings.length; i++) {
              lineSubstrings[i] = `<span style="color:#1FCC69;">${
                lineSubstrings[i].split(/\r|\n/)[0]
              }</span>`
            }

            // lineSubstrings[1] = `<span style="color:#1FCC69;">${
            //   lineSubstrings[1]
            // }</span>`
            lines[1] = lineSubstrings.join(' ')
            row.children[index].innerHTML = lines.join(
              '<span class="blob-code-inner">'
            )
          }

          // row.children[index].innerHTML = row.children[index].innerHTML.replace(
          //   column.split(' ')[1],
          //   `<span style="color:#1FCC69;">${column.split(' ')[1]}</span>`
          // )
        } else {
          applyCommonSyntax(row, index)
        }
      })
    })
  }

  // row.children[index].innerHTML.split('<span class="blob-code-inner">')[1]
  // find blob
  // split the code after that on

  const applyCommonSyntax = (row, index) => {
    // comments
    //debugger
    // if (/^(\+)?(\-)?#.+$/.test(row.innerText.trim())) {
    //   row.children[index].style.color = '#7DB1B9B3'
    //   // } else if (row.innerText.includes('onWhen')) {
    //   //   // debugger
    //   //   row.children[index].children[1].style.color = '#A2E1F9'
    // } else
    if (row.innerText.includes('when')) {
      row.children[index].style.color = '#00AEEF'
    }
  }

  const applyFileSyntax = table => {
    console.log('applying syntax')

    const rows = Array.from(table.children)

    if (rows[0].children[1].innerHTML.includes('<span style="color:#ff8300;">'))
      return

    rows.forEach(row => {
      // debugger
      let substrings = row.children[1].innerHTML.split(' ')

      if (/^[A-Z]/.test(row.innerText)) {
        // block names
        substrings[0] = `<span style="color:#ff8300;">${substrings[0]}</span>`
      } else if (/^#.+$/.test(row.innerText)) {
        // comments
        row.children[1].style.color = '#7DB1B9B3'
      } else if (row.innerText.includes('onWhen')) {
        row.children[1].style.color = '#A2E1F9'
        // } else if (row.innerText.includes('when')) {
        //   row.children[1].style.color = '#00AEEF'
      } else if (row.innerText.includes('<')) {
        // slots
        substrings[1] = `<span style="color:#00AEEF;">${substrings[1]}</span>`
        for (i = 2; i < substrings.length; i++) {
          substrings[i] = `<span style="color:#1FCC69;">${substrings[i]}</span>`
        }
      } else if (/^[a-z]/.test(row.innerText)) {
        // strings
        for (i = 1; i < substrings.length; i++) {
          substrings[i] = `<span style="color:#1FCC69;">${substrings[i]}</span>`
        }
      } else {
        applyCommonSyntax(row, 1)
      }
      row.children[1].innerHTML = substrings.join(' ')
    })
  }

  checkPage()
})()
